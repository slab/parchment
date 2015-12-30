import Blot, { Position } from './blot';
import LeafBlot from './leaf';
import LinkedList from '../../collection/linked-list';
import { ShadowParent } from './shadow';
import * as Registry from '../../registry';


abstract class ParentBlot extends Blot implements ShadowParent {
  static blotName = 'parent';

  domNode: HTMLElement;
  parent: ParentBlot;
  children: LinkedList<Blot>;

  constructor(node: Node) {
    super(node);
    this.children = new LinkedList<Blot>();
    this.build();
  }

  appendChild(other: Blot): void {
    this.insertBefore(other);
  }

  build(): void {
    let childNodes = [].slice.call(this.domNode.childNodes);
    this.children = new LinkedList<Blot>();
    // Need to be reversed for if DOM nodes already in order
    childNodes.reverse().forEach((node) => {
      let child = Blot.findBlot(node) || Registry.create(node);
      this.insertBefore(child, this.children.head);
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
    let [child, offset] = this.children.find(index, true);
    return child.findNode(offset);
  }

  findOffset(node: Node): number {
    if (node === this.domNode) return 0;
    let blot = Blot.findBlot(node);
    if (blot == null || blot.parent !== this) return -1;
    return this.children.offset(blot);
  }

  findPath(index: number, inclusive: boolean = false): Position[] {
    let length = this.getLength();
    let [child, offset] = this.children.find(index, inclusive);
    if (child == null) {
      child = this.children.tail;
      if (child == null) {
        return [{ blot: this, offset: index }];
      }
      offset = child.getLength();
    }
    let pos: Position[] = [{
      blot: this,
      offset: index - offset
    }];
    return pos.concat(child.findPath(offset, inclusive));
  }

  format(name: string, value: any): void {
    if (!value && name === this.statics.blotName) {
      this.unwrap();
    } else {
      super.format(name, value);
    }
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
      } else if (child instanceof ParentBlot) {
        descendants = descendants.concat(child.getDescendants<T>(type));
      }
    });
    return descendants;
  }

  getLeaves(): LeafBlot[] {
    return this.getDescendants<LeafBlot>(LeafBlot);
  }

  getValue(): (Object | string)[] {
    return [].concat.apply([], this.getLeaves().map(function(leaf) {
      return leaf.getValue();
    }));
  }

  getFormat(): Object {
    return {};
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

  insertBefore(childBlot: Blot, refBlot?: Blot): void {
    childBlot.insertInto(this, refBlot);
  }

  moveChildren(targetParent: ParentBlot, refNode?: Blot): void {
    this.children.forEach(function(child) {
      targetParent.insertBefore(child, refNode);
    });
  }

  replaceWith(name: string, value: any): ParentBlot {
    if (name === this.statics.blotName && this.getFormat[name] === value) return this;
    let replacement = <ParentBlot>super.replaceWith(name, value);
    this.moveChildren(replacement);
    return replacement;
  }

  split(index: number, force: boolean = false): Blot {
    if (!force) {
      if (index === 0) return this;
      if (index === this.getLength()) return this.next;
    }
    let after = <ParentBlot>this.clone();
    this.parent.insertBefore(after, this.next);
    this.children.forEachAt(index, this.getLength(), function(child, offset, length) {
      child = <Blot>child.split(offset, force);
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
            let blot = Blot.findBlot(childNode) || Registry.create(childNode);
            if (blot.parent != null) {
              blot.parent.children.remove(blot);
            }
            this.children.insertBefore(blot, child);
          } else {
            child.remove();
          }
        }
        childNode = childNode.nextSibling;
      });
      while (childNode != null) {
        let blot = Blot.findBlot(childNode) || Registry.create(childNode);
        this.children.append(blot);
      }
    }
  }
}


export default ParentBlot;
