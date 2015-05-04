import Registry = require('./registry');
import TreeList = require('./lib/tree-list');
import TreeNode = require('./tree-node');


class ShadowNode implements TreeNode {
  prev: ShadowNode = null;
  next: ShadowNode = null;
  parent: ShadowNode = null;
  children: TreeList = new TreeList();
  domNode: Node;
  class;

  constructor(domNode: Node) {
    this.domNode = domNode;
  }

  append(other) {
    this.insertBefore(other);
  }

  clone() {
    var domNode = this.domNode.cloneNode();
    return Registry.create(this.class.nodeName, domNode);
  }

  insertBefore(childNode, refNode?) {
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

  isolate(index: number, length: number) {
    var target = this.split(index);
    target.split(length);
    return target;
  }

  length(): number {
    return 1;
  }

  mergeNext() {
    // 1. Check we are the same tag and attributes
    // 2. Move children, delete other node
  }

  moveChildren(parent, refNode = null) {
    this.children.forEach(function(child) {
      parent.insertBefore(child, refNode);
    });
  }

  remove() {
    this.parent.children.remove(this);
    if (!!this.domNode.parentNode) this.domNode.parentNode.removeChild(this.domNode);
    this.parent = this.prev = this.next = undefined;
  }

  replace(name, value) {
    if (!this.parent) return;
    var other = Registry.create(name, value);
    this.parent.insertBefore(other, this);
    this.moveChildren(other);
    // TODO handle attributes
    this.remove();
  }

  split(index) {
    if (index === 0) return this;
    if (index === this.length()) return this.next;
    var after = this.clone();
    this.parent.insertBefore(after, this.next);
    this.children.forEachAt(index, this.length(), function(child, offset, length) {
      var child = child.split(offset);
      child.remove();
      after.append(child);
    });
    return after;
  }

  unwrap() {
    this.moveChildren(this.parent, this);
    this.remove();
  }

  wrap(name, value) {
    var other = Registry.create(name, value);
    // TODO handle attributes
    this.parent.insertBefore(other, this);
    this.remove();
    other.append(this);
    this.parent = other;
  }
}


export = ShadowNode;
