import LinkedList from '../collection/linked-list';
import LinkedNode from '../collection/linked-node';
import * as Registry from '../registry';


export interface ShadowParent {
  children: LinkedList<ShadowNode>;

  appendChild(child: ShadowNode): void;
  insertBefore(child: ShadowNode, refNode?: ShadowNode): void;
  moveChildren(parent: ShadowParent, refNode?: ShadowNode): void;
  unwrap(): void;
}


export class ShadowNode implements LinkedNode {
  prev: ShadowNode = null;
  next: ShadowNode = null;
  parent: ShadowParent = null;
  domNode: Node = null;

  constructor(value: any) {
    this.domNode = this.init(value);
  }

  get statics(): any {
    // TODO: Hack for accessing inherited static methods
    return this.constructor;
  }

  init(value: any): Node {
    if (value instanceof Node) return value;
    throw new Error('Shadow must be initialized with DOM Node but got: ' + value)
  }

  clone(): ShadowNode {
    var domNode = this.domNode.cloneNode();
    var name = this.statics.tagName || 'node';
    return Registry.create(name, domNode);
  }

  isolate(index: number, length: number): ShadowNode {
    var target = this.split(index);
    target.split(length);
    return target;
  }

  length(): number {
    return 1;
  }

  merge() {
    // if (this.next != null && this.getFormat() === this.next.getFormat()) {  // TODO implement object comparison
    //   var lastChild = this.children.tail;
    //   this.next.moveChildren(this, null);
    //   this.next.remove();
    //   this.merge();
    //   if (lastChild != null) {
    //     lastChild.merge();
    //   }
    // }
  }

  remove(): void {
    this.parent.children.remove(this);
    if (this.domNode.parentNode != null) this.domNode.parentNode.removeChild(this.domNode);
    this.parent = this.prev = this.next = undefined;
  }

  replace(name: string, value: any): ShadowNode {
    if (this.parent == null) return;
    var replacement = Registry.create(name, value);
    this.parent.insertBefore(replacement, this);
    // TODO handle attributes
    this.remove();
    return replacement;
  }

  split(index: number): ShadowNode {
    return index === 0 ? this : this.next;
  }

  wrap(name: string, value: any): ShadowParent {
    var wrapper = Registry.create(name, value);
    // TODO handle attributes
    this.parent.insertBefore(wrapper, this);
    this.remove();
    wrapper.appendChild(this);
    this.parent = wrapper;
    return wrapper;
  }
}
