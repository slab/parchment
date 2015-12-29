import LinkedList from '../../collection/linked-list';
import LinkedNode from '../../collection/linked-node';
import * as Registry from '../../registry';

interface ShadowStatic {
  blotName: string;
  className: string;
  scope: Registry.Scope;
  tagName: string;
}

interface ShadowParent extends ShadowNode {
  children: LinkedList<ShadowNode>;
  domNode: HTMLElement;

  appendChild(child: ShadowNode): void;
  insertBefore(child: ShadowNode, refNode?: ShadowNode): void;
  moveChildren(parent: ShadowParent, refNode?: ShadowNode): void;
  unwrap(): void;
}

class ShadowNode implements LinkedNode {
  static blotName: string;

  prev: ShadowNode;
  next: ShadowNode;
  parent: ShadowParent;
  domNode: Node;

  constructor(node: Node) {
    this.domNode = node;
  }

  // TODO: Hack for accessing inherited static methods
  get statics(): ShadowStatic {
    let statics = <any>this.constructor;
    return {
      blotName: statics.blotName,
      className: statics.className,
      scope: statics.scope,
      tagName: statics.tagName
    };
  }

  clone(): ShadowNode {
    let domNode = this.domNode.cloneNode();
    return Registry.create(domNode);
  }

  getLength(): number {
    return 1;
  }

  isolate(index: number, length: number): ShadowNode {
    let target = this.split(index);
    target.split(length);
    return target;
  }

  remove(): void {
    if (this.parent == null) return;
    this.parent.children.remove(this);
    if (this.domNode.parentNode != null) {
      this.domNode.parentNode.removeChild(this.domNode);
    }
  }

  replace(target: ShadowNode) {
    if (target.parent == null) return;
    this.remove();
    target.parent.insertBefore(this, target.next);
    target.remove();
  }

  replaceWith(name: string, value: any): ShadowParent {
    let replacement = Registry.create(name, value);
    replacement.replace(this);
    return replacement;
  }

  split(index: number, force?: boolean): ShadowNode {
    return index === 0 ? this : this.next;
  }

  wrap(name: string, value: any): ShadowParent {
    let wrapper = Registry.create(name, value);
    this.parent.insertBefore(wrapper, this.next);
    wrapper.appendChild(this);
    return wrapper;
  }
}

export { ShadowParent, ShadowNode as default };
