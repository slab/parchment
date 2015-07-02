import Blot, { Position } from '../blot';
import LinkedList from '../../collection/linked-list';
import { ShadowParent } from '../shadow';
import * as Registry from '../../registry';


class ParentBlot extends Blot implements ShadowParent {
  static blotName = 'parent';

  parent: ParentBlot = null;
  children: LinkedList<Blot> = new LinkedList<Blot>();

  constructor(value: HTMLElement) {
    super(value);
    this.build();
  }

  appendChild(other: Blot): void {
    this.insertBefore(other);
  }

  build(): void {
    var childNodes = Array.prototype.slice.call(this.domNode.childNodes);
    childNodes.forEach((node) => {
      var BlotClass = Registry.match(node);
      if (BlotClass != null) {
        let child = new BlotClass(node);
        this.appendChild(child);
      } else if (node.parentNode != null) {
        node.parentNode.removeChild(node);
      }
    });
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
    var pos: Position[] = [{
      blot: this,
      offset: index - offset
    }];
    return pos.concat(child.findPath(offset));
  }

  format(name: string, value: any): void {
    if (value && name === this.statics.blotName) {
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

  getValue(): any[] {
    return this.children.reduce(function(memo, child) {
      var value = child.getValue();
      if (value instanceof Array) {
        memo = memo.concat(value);
      } else if (value != null) {
        memo.push(value);
      }
      return memo;
    }, []);
  }

  insertAt(index: number, value: string, def?: any): void {
    var _arr = this.children.find(index);
    var child = _arr[0], offset = _arr[1];
    child.insertAt(offset, value, def);
  }

  insertBefore(childBlot: Blot, refBlot?: Blot): void {
    this.children.insertBefore(childBlot, refBlot);
    if (refBlot != null) {
      var refDomNode = refBlot.domNode;
    }
    if (childBlot.next == null || childBlot.domNode.nextSibling != refDomNode) {
      this.domNode.insertBefore(childBlot.domNode, refDomNode);
    }
    childBlot.parent = this;
  }

  length(): number {
    return this.children.reduce(function(memo, child) {
      return memo + child.length();
    }, 0);
  }

  moveChildren(parent: ParentBlot, refNode?: Blot): void {
    this.children.forEach(function(child) {
      parent.insertBefore(child, refNode);
    });
  }

  replace(name: string, value: any): ParentBlot {
    if (name === this.statics.blotName) {
      return this;
    }
    var replacement = <ParentBlot>super.replace(name, value);
    this.moveChildren(replacement);
    this.moveAttributes(replacement);
    return replacement;
  }

  split(index: number, force: boolean = false): Blot {
    if (!force) {
      if (index === 0) return this;
      if (index === this.length()) return this.next;
    }
    var after = <ParentBlot>this.clone();
    this.parent.insertBefore(after, this.next);
    this.children.forEachAt(index, this.length(), function(child, offset, length) {
      var child = <Blot>child.split(offset, force);
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


export default ParentBlot;
