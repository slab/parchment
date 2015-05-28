import Blot, { Position } from '../blot';
import LinkedList from '../../collection/linked-list';
import { ShadowParent } from '../shadow';
import * as Registry from '../../registry';


class ParentBlot extends Blot implements ShadowParent {
  static nodeName = 'parent';

  parent: ParentBlot = null;
  children: LinkedList<Blot> = new LinkedList<Blot>();

  constructor(value: HTMLElement) {
    super(value);
    this.build();
  }

  appendChild(other: Blot): void {
    this.insertBefore(other);
  }

  insertBefore(childNode: Blot, refNode?: Blot): void {
    this.children.insertBefore(childNode, refNode);
    var refDomNode = null;
    if (refNode != null) {
      refDomNode = refNode.domNode;
    }
    if (childNode.next == null || childNode.domNode.nextSibling != refDomNode) {
      this.domNode.insertBefore(childNode.domNode, refDomNode);
    }
    childNode.parent = this;
  }

  moveChildren(parent: ParentBlot, refNode?: Blot): void {
    this.children.forEach(function(child) {
      parent.insertBefore(child, refNode);
    });
  }

  replace(name: string, value: any): ParentBlot {
    if (name === this.statics.nodeName) {
      return this;
    }
    var replacement = <ParentBlot>super.replace(name, value);
    this.moveChildren(replacement);
    this.moveAttributes(replacement);
    return replacement;
  }

  split(index: number): Blot {
    if (index === 0) return this;
    if (index === this.length()) return this.next;
    var after = <ParentBlot>this.clone();
    this.parent.insertBefore(after, this.next);
    this.children.forEachAt(index, this.length(), function(child, offset, length) {
      var child = <Blot>child.split(offset);
      child.remove();
      after.appendChild(child);
    });
    return after;
  }

  unwrap(): void {
    this.moveChildren(this.parent, this);
    this.remove();
  }

  build(): void {
    var childNodes = Array.prototype.slice.call(this.domNode.childNodes || []);
    childNodes.forEach((node) => {
      var BlotClass = Registry.match(node);
      if (BlotClass != null) {
        var child = new BlotClass(node);
        this.appendChild(child);
      } else if (node.parentNode != null) {
        node.parentNode.removeChild(node);
      }
    });
  }

  length(): number {
    return this.children.reduce(function(memo, child) {
      return memo + child.length();
    }, 0);
  }

  values(): any[] {
    return this.children.reduce(function(memo, child) {
      var value = child.values();
      if (value instanceof Array) {
        memo = memo.concat(value);
      } else if (value != null) {
        memo.push(value);
      }
      return memo;
    }, []);
  }

  deleteAt(index: number, length: number): void {
    if (index === 0 && length === this.length()) {
      this.remove();
    } else {
      this.children.forEachAt(index, length, function(child, offset, length) {
        child.deleteAt(offset, length);
      });
    }
  }

  findPath(index: number): Position[] {
    var _arr = this.children.find(index);
    var child = _arr[0], offset = _arr[1];
    var pos:Position[] = [{
      blot: this,
      offset: index - offset
    }];
    return pos.concat(child.findPath(offset));
  }

  format(name: string, value: any): void {
    if (value && name === this.statics.nodeName) {
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

  insertAt(index: number, value: string, def?: any): void {
    var _arr = this.children.find(index);
    var child = _arr[0], offset = _arr[1];
    child.insertAt(offset, value, def);
  }
}


export default ParentBlot;
