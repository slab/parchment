import Blot, { Position } from '../blot';
import LinkedList from '../../collection/linked-list';
import { ShadowParent } from '../shadow';
import * as Registry from '../../registry';


class ParentBlot extends Blot implements ShadowParent {
  static blotName = 'parent';

  domNode: HTMLElement;
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
    this.children.empty();
    childNodes.forEach((node) => {
      var child = Registry.create(node);
      if (child != null) {
        this.appendChild(child);
      } else if (node.parentNode != null) {
        node.parentNode.removeChild(node);
      }
    });
  }

  deleteAt(index: number, length: number): void {
    if (index === 0 && length === this.getLength()) {
      this.remove();
    } else {
      this.children.forEachAt(index, length, function(child, offset, length) {
        child.deleteAt(offset, length);
      });
    }
  }

  findPath(index: number): Position[] {
    var child, offset;
    if (index < this.getLength()) {
      let arr = this.children.find(index);
      child = arr[0], offset = arr[1];
    } else {
      child = this.children.tail;
      offset = child.getLength();
    }
    var pos: Position[] = [{
      blot: this,
      offset: index - offset
    }];
    return pos.concat(child.findPath(offset));
  }

  format(name: string, value: any): void {
    if (!value && name === this.statics.blotName) {
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

  getLength(): number {
    return this.children.reduce(function(memo, child) {
      return memo + child.getLength();
    }, 0);
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
    if (child) {
      child.insertAt(offset, value, def);
    } else {
      let blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
      this.insertBefore(blot);
    }
  }

  insertBefore(childBlot: Blot, refBlot?: Blot): void {
    if (childBlot.parent != null) {
      childBlot.parent.children.remove(childBlot);
    }
    this.children.insertBefore(childBlot, refBlot);
    if (refBlot != null) {
      var refDomNode = refBlot.domNode;
    }
    if (childBlot.next == null || childBlot.domNode.nextSibling != refDomNode) {
      this.domNode.insertBefore(childBlot.domNode, refDomNode);
    }
    childBlot.parent = this;
  }

  moveChildren(targetParent: ParentBlot, refNode?: Blot): void {
    this.children.forEach((child) => {
      targetParent.insertBefore(child, refNode);
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
      if (index === this.getLength()) return this.next;
    }
    var after = <ParentBlot>this.clone();
    this.parent.insertBefore(after, this.next);
    this.children.forEachAt(index, this.getLength(), function(child, offset, length) {
      var child = <Blot>child.split(offset, force);
      if (child) {
        after.appendChild(child);
      }
    });
    return after;
  }

  unwrap(): void {
    this.moveChildren(this.parent, this.next);
    this.remove();
  }
}


export default ParentBlot;
