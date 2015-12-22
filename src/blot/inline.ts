import Blot from './abstract/blot';
import FormatBlot from './abstract/format';
import LeafBlot from './abstract/leaf';
import ParentBlot from './abstract/parent';
import * as Registry from '../registry';
import { ShadowParent } from './abstract/shadow';
import LinkedList from '../collection/linked-list';

type ChildBlot = InlineBlot | LeafBlot;

// Shallow object comparison
function isEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  for (let prop in obj1) {
    if (obj1[prop] !== obj2[prop]) return false;
  }
  return true;
}


class InlineBlot extends FormatBlot {
  static blotName = 'inline';
  static scope = Registry.Scope.INLINE | Registry.Scope.BLOT;
  static tagName = 'SPAN';

  children: LinkedList<ChildBlot>;

  static compare = function(thisName: string, otherName: string): boolean {
    return thisName <= otherName;
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    if (Registry.match(name, Registry.Scope.ATTRIBUTE) ||
        InlineBlot.compare(this.statics.blotName, name)) {
      var formats = this.getFormat();
      if (value && formats[name] === value) return;
      if (!value && !formats[name]) return;
      let target = <Blot>this.isolate(index, length);
      target.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }

  insertBefore(childBlot: ChildBlot, refBlot?: ChildBlot): void {
    super.insertBefore(childBlot, refBlot);
  }

  optimize(): void {
    if (this.children.length === 0) {
      return this.unwrap();  // unformatted span
    }
    let formats = this.getFormat();
    if (Object.keys(formats).length === 0) {
      return this.unwrap();
    }
    let prev = this.prev;
    if (prev instanceof InlineBlot && isEqual(formats, prev.getFormat())) {
      prev.moveChildren(this, this.children.head);
      prev.remove();
    }
    super.optimize();
  }

  unwrap(): void {
    if (Object.keys(this.attributes).length) {
      this.replace(InlineBlot.blotName, true);
    } else {
      super.unwrap();
    }
  }

  wrap(name: string, value: any): ParentBlot {
    if (name === this.statics.blotName) {
      return this.replace(name, value);
    } else {
      let wrapper = <InlineBlot>super.wrap(name, value);
      this.moveAttributes(wrapper);
      return wrapper;
    }
  }
}


export default InlineBlot;
