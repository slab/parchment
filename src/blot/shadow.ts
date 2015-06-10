import LinkedList from '../collection/linked-list';
import LinkedNode from '../collection/linked-node';
import * as Registry from '../registry';

interface ShadowStatic {
  blotName: string;
  tagName: string;
  compare?: (string) => boolean;
}

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

  constructor(node: Node) {
    if (!(node instanceof Node)) {
      throw new Error(`Shadow must be initialized with DOM Node but got: ${node}`);
    }
    this.domNode = node;
  }

  // TODO: Hack for accessing inherited static methods
  get statics(): ShadowStatic {
    var statics = <any>this.constructor;
    return {
      blotName: statics.blotName,
      tagName: statics.tagName,
      compare: statics.compare
    };
  }

  clone(): ShadowNode {
    var domNode = this.domNode.cloneNode();
    var name = this.statics.tagName || 'blot';
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

  remove(): void {
    this.parent.children.remove(this);
    if (this.domNode.parentNode != null) this.domNode.parentNode.removeChild(this.domNode);
    this.parent = this.prev = this.next = undefined;
  }

  replace(name: string, value: any): ShadowNode {
    if (this.parent == null) return;
    var replacement = Registry.create(name, value);
    this.parent.insertBefore(replacement, this);
    this.remove();
    return replacement;
  }

  split(index: number): ShadowNode {
    return index === 0 ? this : this.next;
  }

  wrap(name: string, value: any): ShadowParent {
    var wrapper = Registry.create(name, value);
    this.parent.insertBefore(wrapper, this);
    this.remove();
    wrapper.appendChild(this);
    this.parent = wrapper;
    return wrapper;
  }
}
