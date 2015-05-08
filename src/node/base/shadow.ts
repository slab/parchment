import LinkedList = require('../../lib/linked-list');
import LinkedNode = require('../../lib/linked-node');
import Registry = require('../../registry');


export class ShadowNode implements LinkedNode {
  prev: ShadowNode = null;
  next: ShadowNode = null;
  parent: ShadowParent = null;
  domNode: Node = null;
  class;

  constructor(domNode: Node) {
    this.domNode = domNode;
  }

  get statics(): any {
    // TODO: Hack for accessing inherited static methods
    return this.constructor;
  }

  clone(): ShadowNode {
    var domNode = this.domNode.cloneNode();
    return Registry.create('node', domNode);
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
    // if (!!this.next && this.getFormat() === this.next.getFormat()) {  // TODO implement object comparison
    //   var lastChild = this.children.tail;
    //   this.next.moveChildren(this, null);
    //   this.next.remove();
    //   this.merge();
    //   if (!!lastChild) {
    //     lastChild.merge();
    //   }
    // }
  }

  remove(): void {
    this.parent.children.remove(this);
    if (!!this.domNode.parentNode) this.domNode.parentNode.removeChild(this.domNode);
    this.parent = this.prev = this.next = undefined;
  }

  replace(name: string, value: any): ShadowNode {
    if (!this.parent) return;
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
    var wrapper:ShadowParent = Registry.create(name, value);
    // TODO handle attributes
    this.parent.insertBefore(wrapper, this);
    this.remove();
    wrapper.appendChild(this);
    this.parent = wrapper;
    return wrapper;
  }
}

export class ShadowParent extends ShadowNode {
  children: LinkedList<ShadowNode> = new LinkedList<ShadowNode>();

  appendChild(other: ShadowNode): void {
    this.insertBefore(other);
  }

  insertBefore(childNode: ShadowNode, refNode?: ShadowNode): void {
    this.children.insertBefore(childNode, refNode);
    var refDomNode = null;
    if (!!refNode) {
      refDomNode = refNode.domNode;
    }
    if (!childNode.next || childNode.domNode.nextSibling != refDomNode) {
      this.domNode.insertBefore(childNode.domNode, refDomNode);
    }
    childNode.parent = this;
  }

  isolate(index: number, length: number): ShadowParent {
    return <ShadowParent>super.isolate(index, length);
  }

  moveChildren(parent: ShadowParent, refNode?: ShadowNode): void {
    this.children.forEach(function(child) {
      parent.insertBefore(child, refNode);
    });
  }

  replace(name: string, value: any): ShadowParent {
    var replacement = <ShadowParent>super.replace(name, value);
    this.moveChildren(replacement);
    return replacement;
  }

  split(index: number): ShadowNode {
    if (index === 0) return this;
    if (index === this.length()) return this.next;
    var after = <ShadowParent>this.clone();
    this.parent.insertBefore(after, this.next);
    this.children.forEachAt(index, this.length(), function(child, offset, length) {
      var child = child.split(offset);
      child.remove();
      after.appendChild(child);
    });
    return after;
  }

  unwrap(): void {
    this.moveChildren(this.parent, this);
    this.remove();
  }
}
