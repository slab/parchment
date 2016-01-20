import FormatBlot from './abstract/format';
import ShadowBlot from './abstract/shadow';
import * as Registry from '../registry';


// Shallow object comparison
function isEqual(obj1, obj2): boolean {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  for (let prop in obj1) {
    if (obj1[prop] !== obj2[prop]) return false;
  }
  return true;
}


class InlineBlot extends FormatBlot {
  static blotName = 'inline';
  static scope = Registry.Scope.INLINE_BLOT;
  static tagName = 'SPAN';

  formatAt(index: number, length: number, name: string, value: any): void {
    if (this.formats()[name] != null) {
      let blot = <InlineBlot>this.isolate(index, length);
      blot.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }

  optimize(): void {
    super.optimize();
    let formats = this.formats();
    if (Object.keys(formats).length === 0) {
      return this.unwrap();  // unformatted span
    }
    let next = this.next;
    if (next instanceof InlineBlot && next.prev === this && isEqual(formats, next.formats())) {
      next.moveChildren(this);
      next.remove();
    }
  }
}


export default InlineBlot;
