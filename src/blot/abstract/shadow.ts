import { Blot, BlotConstructor, Formattable, Parent, Root } from './blot';
import ParchmentError from '../../error';
import Scope from '../../scope';
import Registry from '../../registry';

class ShadowBlot implements Blot {
  static blotName = 'abstract';
  static className: string;
  static requiredContainer: BlotConstructor;
  static scope: Scope;
  static tagName: string;

  prev: Blot | null;
  next: Blot | null;
  // @ts-ignore
  parent: Parent;

  // Hack for accessing inherited static methods
  get statics(): any {
    return this.constructor;
  }

  static create(value: any): Node {
    if (this.tagName == null) {
      throw new ParchmentError('Blot definition missing tagName');
    }
    let node;
    if (Array.isArray(this.tagName)) {
      if (typeof value === 'string') {
        value = value.toUpperCase();
        if (parseInt(value).toString() === value) {
          value = parseInt(value);
        }
      }
      if (typeof value === 'number') {
        node = document.createElement(this.tagName[value - 1]);
      } else if (this.tagName.indexOf(value) > -1) {
        node = document.createElement(value);
      } else {
        node = document.createElement(this.tagName[0]);
      }
    } else {
      node = document.createElement(this.tagName);
    }
    if (this.className) {
      node.classList.add(this.className);
    }
    return node;
  }

  constructor(public scroll: Root, public domNode: Node) {
    Registry.blots.set(domNode, this);
    this.prev = null;
    this.next = null;
  }

  attach(): void {
    // Nothing to do
  }

  clone(): Blot {
    let domNode = this.domNode.cloneNode(false);
    return this.scroll.create(domNode);
  }

  detach() {
    if (this.parent != null) this.parent.removeChild(this);
    Registry.blots.delete(this.domNode);
  }

  deleteAt(index: number, length: number): void {
    let blot = this.isolate(index, length);
    blot.remove();
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    let blot = this.isolate(index, length);
    if (this.scroll.query(name, Scope.BLOT) != null && value) {
      blot.wrap(name, value);
    } else if (this.scroll.query(name, Scope.ATTRIBUTE) != null) {
      let parent = <Parent & Formattable>this.scroll.create(this.statics.scope);
      blot.wrap(parent);
      parent.format(name, value);
    }
  }

  insertAt(index: number, value: string, def?: any): void {
    let blot =
      def == null
        ? this.scroll.create('text', value)
        : this.scroll.create(value, def);
    let ref = this.split(index);
    this.parent.insertBefore(blot, ref || undefined);
  }

  isolate(index: number, length: number): Blot {
    let target = this.split(index);
    if (target == null) {
      throw new Error('Attempt to isolate at end');
    }
    target.split(length);
    return target;
  }

  length(): number {
    return 1;
  }

  offset(root: Blot = this.parent): number {
    if (this.parent == null || this == root) return 0;
    return this.parent.children.offset(this) + this.parent.offset(root);
  }

  optimize(context: { [key: string]: any }): void {
    if (
      this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)
    ) {
      this.wrap(this.statics.requiredContainer.blotName);
    }
  }

  remove(): void {
    if (this.domNode.parentNode != null) {
      this.domNode.parentNode.removeChild(this.domNode);
    }
    this.detach();
  }

  replaceWith(name: string | Blot, value?: any): Blot {
    const replacement =
      typeof name === 'string' ? this.scroll.create(name, value) : name;
    if (this.parent != null) {
      this.parent.insertBefore(replacement, this.next || undefined);
      this.remove();
    }
    return replacement;
  }

  split(index: number, force?: boolean): Blot | null {
    return index === 0 ? this : this.next;
  }

  update(mutations: MutationRecord[], context: { [key: string]: any }): void {
    // Nothing to do by default
  }

  wrap(name: string | Parent, value?: any): Parent {
    let wrapper =
      typeof name === 'string' ? <Parent>this.scroll.create(name, value) : name;
    if (this.parent != null) {
      this.parent.insertBefore(wrapper, this.next || undefined);
    }
    wrapper.appendChild(this);
    return wrapper;
  }
}

export default ShadowBlot;
