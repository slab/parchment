import Blot from './blot';
import LinkedList from '../../collection/linked-list';
import ShadowBlot, { ParentBlot } from './shadow';
import * as Registry from '../../registry';


abstract class ContainerBlot extends Blot implements ParentBlot {
  children: LinkedList<ShadowBlot>;
  domNode: HTMLElement;

  static isBlot<T>(blot, T): blot is T {
    if (T === ParentBlot && blot instanceof ContainerBlot) return true;
    return super.isBlot<T>(blot, T);
  }

  constructor(domNode: HTMLElement) {
    super(domNode);
    this.build();
  }

  appendChild(other: ShadowBlot): void {
    this.insertBefore(other);
  }

  build(): void {
    this.children = new LinkedList<ShadowBlot>();
    // Need to be reversed for if DOM nodes already in order
    [].slice.call(this.domNode.childNodes).reverse().forEach((node) => {
      try {
        let child = Blot.findBlot(node) || Registry.create(node);
        this.insertBefore(child, this.children.head);
      } catch (skipBlot) {}
    });
  }

  deleteAt(index: number, length: number): void {
    if (index === 0 && length === this.getLength()) {
      this.remove();
    } else {
      this.children.forEachAt(index, length, function(child, offset, length) {
        child.deleteAt(offset, length);
      });
    }
  }

  findNode(index: number): [Node, number] {
    let [child, offset] = this.children.find(index);
    return child.findNode(offset);
  }

  findOffset(node: Node): number {
    if (node === this.domNode) return 0;
    let blot = Blot.findBlot(node);
    if (blot == null || blot.parent !== this) return -1;
    return this.children.offset(blot);
  }

  findPath(index: number): [ShadowBlot, number][] {
    let [child, offset] = this.children.find(index);
    if (child == null) return [[this, index]];
    let position: [ShadowBlot, number][] = [[this, index - offset]];
    if (child instanceof ContainerBlot) {
      return position.concat(child.findPath(offset));
    }
    return position;
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.children.forEachAt(index, length, function(child, offset, length) {
      child.formatAt(offset, length, name, value);
    });
  }

  getDescendants<T>(type: any): T[];
  getDescendants<T>(index: number, length: number, type: any): T[];
  getDescendants<T>(index: any, length?: number, type?: any): T[] {
    if (typeof length !== 'number') {
      type = index;
      index = 0;
      length = this.getLength();
    }
    let descendants = [];
    this.children.forEachAt(index, length, function(child) {
      if (child instanceof type) {
        descendants.push(child);
      }
      if (child instanceof ContainerBlot) {
        descendants = descendants.concat(child.getDescendants<T>(type));
      }
    });
    return descendants;
  }

  getLength(): number {
    return this.children.reduce(function(memo, child) {
      return memo + child.getLength();
    }, 0);
  }

  insertAt(index: number, value: string, def?: any): void {
    let [child, offset] = this.children.find(index);
    if (child) {
      child.insertAt(offset, value, def);
    } else {
      let blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
      this.insertBefore(blot);
    }
  }

  insertBefore(childBlot: ShadowBlot, refBlot?: ShadowBlot): void {
    childBlot.insertInto(this, refBlot);
  }

  moveChildren(targetParent: ParentBlot, refNode?: ShadowBlot): void {
    this.children.forEach(function(child) {
      targetParent.insertBefore(child, refNode);
    });
  }

  optimize(mutation: MutationRecord[] = []) {
    if (this.children.length === 0 && this.statics.child != null) {
      let args = typeof this.statics.child === 'string' ? [this.statics.child] : this.statics.child;
      let child = Registry.create.apply(Registry, args);
      this.appendChild(child);
      child.optimize();
    }
  }

  replace(target: ParentBlot): void {
    target.moveChildren(this);
    super.replace(target);
  }

  split(index: number, force: boolean = false): ShadowBlot {
    if (!force) {
      if (index === 0) return this;
      if (index === this.getLength()) return this.next;
    }
    let after = <ParentBlot>this.clone();
    this.parent.insertBefore(after, this.next);
    this.children.forEachAt(index, this.getLength(), function(child, offset, length) {
      child = child.split(offset, force);
      after.appendChild(child);
    });
    return after;
  }

  unwrap(): void {
    this.moveChildren(this.parent, this.next);
    this.remove();
  }

  update(mutations: MutationRecord[]): void {
    let updated = mutations.some((mutation) => {
      return mutation.target === this.domNode && mutation.type === 'childList';
    });
    if (updated) {
      let childNode = this.domNode.firstChild;
      this.children.forEach((child) => {
        while (childNode !== child.domNode) {
          if (child.domNode.parentNode === this.domNode) {
            // New child inserted
            let blot = Blot.findBlot(childNode) || Registry.create(childNode);
            if (blot.parent != null) {
              blot.parent.children.remove(blot);
            }
            this.insertBefore(blot, child);
            childNode = childNode.nextSibling;
          } else {
            // Existing child removed
            return child.remove();
          }
        }
        childNode = childNode.nextSibling;
      });
      while (childNode != null) {
        let blot = Blot.findBlot(childNode) || Registry.create(childNode);
        this.insertBefore(blot);
        childNode = childNode.nextSibling;
      }
    }
  }

  // wrap(name: string, value: any): ParentBlot {
  //   if (name === this.statics.blotName) {
  //     return this.replaceWith(name, value);
  //   } else {
  //     return super.wrap(name, value);
  //   }
  // }
}


export default ContainerBlot;
