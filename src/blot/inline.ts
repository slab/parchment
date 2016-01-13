import Blot from './abstract/blot';
import FormatBlot from './abstract/format';
import LeafBlot from './abstract/leaf';
import * as Registry from '../registry';
import LinkedList from '../collection/linked-list';


type ChildBlot = InlineBlot | LeafBlot;

// Shallow object comparison
function isEqual(obj1, obj2) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  for (let prop in obj1) {
    if (obj1[prop] !== obj2[prop]) return false;
  }
  return true;
}


class InlineBlot extends FormatBlot {
  static blotName = 'inline';
  static scope = Registry.Scope.INLINE & Registry.Scope.BLOT;
  static tagName = 'SPAN';

  children: LinkedList<ChildBlot>;

  static compare = function(thisName: string, otherName: string): boolean {
    return thisName <= otherName;
  }

  format(name: string, value: any): void {
    if (Registry.match(name, this.statics.scope) != null) {
      if (value) {
        this.wrap(name, value);
      } else {
        this.unwrap();
      }
    } else {
      super.format(name, value);
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    if (Registry.match(name, Registry.Scope.ATTRIBUTE) ||
        InlineBlot.compare(this.statics.blotName, name)) {
      let formats = this.getFormat();
      if (value && formats[name] === value) return;
      if (!value && !formats[name]) return;
      let target = <InlineBlot>this.isolate(index, length);
      target.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }

  getFormat(): Object {
    let format = super.getFormat();
    if (this.statics.blotName === InlineBlot.blotName) delete format[InlineBlot.blotName];
    return format;
  }

  insertBefore(childBlot: ChildBlot, refBlot?: ChildBlot): void {
    super.insertBefore(childBlot, refBlot);
  }

  optimize(): void {
    super.optimize();
    if (this.children.length === 0) {
      return this.unwrap();  // empty span
    }
    let formats = this.getFormat();
    if (Object.keys(formats).length === 0) {
      return this.unwrap();  // unformatted span
    }
    let next = this.next;
    if (next instanceof InlineBlot && next.prev === this && isEqual(formats, next.getFormat())) {
      let tail = this.children.tail;
      next.moveChildren(this);
      next.remove();
    }
  }

  unwrap(): void {
    if (Object.keys(this.attributes).length) {
      this.replaceWith(InlineBlot.blotName, true);
    } else {
      super.unwrap();
    }
  }
}


export default InlineBlot;
