import * as Registry from '../../registry';
import ParentBlot from "./parent";
import Formattable from './formattable';
import LinkedNode from "../../collection/linked-node";

class ShadowBlot implements LinkedNode {
  static blotName = 'abstract';
  static className: string;
  static requiredContainer: Registry.BlotConstructor
  static scope: Registry.Scope;
  static tagName: string;

  prev: ShadowBlot | null;
  next: ShadowBlot | null;
  // @ts-ignore
  parent: ParentBlot;
  // @ts-ignore
  scroll: ParentBlot;

  // Hack for accessing inherited static methods
  get statics(): any {
    return this.constructor;
  }

  static create(value: any): Node {
    if (this.tagName == null) {
      throw new Registry.ParchmentError('Blot definition missing tagName');
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

  constructor(public domNode: Node) {
    // @ts-ignore
    this.domNode[Registry.DATA_KEY] = { blot: this };
    this.prev = null;
    this.next = null;
  }

  attach(): void {
    if (this.parent != null) {
      this.scroll = this.parent.scroll;
    }
  }

  clone(): ShadowBlot {
    let domNode = this.domNode.cloneNode(false);
    return Registry.create(domNode);
  }

  detach() {
    if (this.parent != null) this.parent.removeChild(this);
    // @ts-ignore
    delete this.domNode[Registry.DATA_KEY];
  }

  deleteAt(index: number, length: number): void {
    let blot = this.isolate(index, length);
    blot.remove();
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    let blot = this.isolate(index, length);
    if (Registry.query(name, Registry.Scope.BLOT) != null && value) {
      blot.wrap(name, value);
    } else if (Registry.query(name, Registry.Scope.ATTRIBUTE) != null) {
      let parent = <ParentBlot & Formattable>Registry.create(this.statics.scope);
      blot.wrap(parent);
      parent.format(name, value);
    }
  }

  insertAt(index: number, value: string, def?: any): void {
    let blot =
      def == null
        ? Registry.create('text', value)
        : Registry.create(value, def);
    let ref = this.split(index);
    this.parent.insertBefore(blot, ref || undefined);
  }

  isolate(index: number, length: number): ShadowBlot {
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

  offset(root: ShadowBlot = this.parent): number {
    if (this.parent == null || this == root) return 0;
    return this.parent.children.offset(this) + this.parent.offset(root);
  }

  optimize(context: { [key: string]: any }): void {
    // TODO clean up once we use WeakMap
    // @ts-ignore
    if (this.domNode[Registry.DATA_KEY] != null) {
      // @ts-ignore
      delete this.domNode[Registry.DATA_KEY].mutations;
    }
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

  replaceWith(name: string | ShadowBlot, value?: any): ShadowBlot {
    const replacement =
      typeof name === 'string' ? Registry.create(name, value) : name;
    if (this.parent != null) {
      this.parent.insertBefore(replacement, this.next || undefined);
      this.remove();
    }
    return replacement;
  }

  split(index: number, force?: boolean): ShadowBlot | null {
    return index === 0 ? this : this.next;
  }

  update(mutations: MutationRecord[], context: { [key: string]: any }): void {
    // Nothing to do by default
  }

  wrap(name: string | ParentBlot, value?: any): ParentBlot {
    let wrapper =
      typeof name === 'string' ? <ParentBlot>Registry.create(name, value) : name;
    if (this.parent != null) {
      this.parent.insertBefore(wrapper, this.next || undefined);
    }
    wrapper.appendChild(this);
    return wrapper;
  }
}

export default ShadowBlot;
