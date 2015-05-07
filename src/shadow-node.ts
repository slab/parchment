import Registry = require('./registry');
import TreeList = require('./lib/tree-list');
import TreeNode = require('./tree-node');


class ShadowNode implements TreeNode {
  prev: ShadowNode = null;
  next: ShadowNode = null;
  parent: ShadowNode = null;
  children: TreeList = new TreeList();
  domNode: Node;

  constructor(domNode: Node) {
    this.domNode = domNode;
  }

  append(other: ShadowNode): void {
    this.insertBefore(other);
  }

  clone(): ShadowNode {
    var domNode = this.domNode.cloneNode();
    return Registry.create('node', domNode);
  }

  getLength(): number {
    return 1;
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

  isolate(index: number, length: number): ShadowNode {
    var target = this.split(index);
    target.split(length);
    return target;
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

  moveChildren(parent: ShadowNode, refNode?:ShadowNode): void {
    this.children.forEach(function(child) {
      parent.insertBefore(child, refNode);
    });
  }

  remove(): void {
    this.parent.children.remove(this);
    if (!!this.domNode.parentNode) this.domNode.parentNode.removeChild(this.domNode);
    this.parent = this.prev = this.next = undefined;
  }

  replace(name: string, value:any): void {
    if (!this.parent) return;
    var other = Registry.create(name, value);
    this.parent.insertBefore(other, this);
    this.moveChildren(other);
    // TODO handle attributes
    this.remove();
  }

  split(index: number): ShadowNode {
    if (index === 0) return this;
    if (index === this.getLength()) return this.next;
    var after = this.clone();
    this.parent.insertBefore(after, this.next);
    this.children.forEachAt(index, this.getLength(), function(child, offset, length) {
      var child = child.split(offset);
      child.remove();
      after.append(child);
    });
    return after;
  }

  unwrap(): void {
    this.moveChildren(this.parent, this);
    this.remove();
  }

  wrap(name: string, value: any): void {
    var other = Registry.create(name, value);
    // TODO handle attributes
    this.parent.insertBefore(other, this);
    this.remove();
    other.append(this);
    this.parent = other;
  }
}


export = ShadowNode;
