import Blot from '../blot';
import ParentBlot from './parent';
import { ShadowParent } from '../shadow';


class InlineBlot extends ParentBlot {
  static blotName = 'inline';
  static tagName = 'SPAN';

  static compare = function(otherName: string): boolean {
    return this.blotName < otherName;
  }

  formats() {
    var formats = super.formats();
    formats[this.statics.blotName] = true;
    return formats;
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    if (this.statics.compare(name)) {
      let target = <Blot>this.isolate(index, length);
      target.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }

  wrap(name: string, value: any): ShadowParent {
    if (name === this.statics.blotName) {
      return this;
    } else if (this.statics.blotName === InlineBlot.blotName) {
      return this.replace(name, value);
    } else {
      let wrapper = <ParentBlot>super.wrap(name, value);
      this.moveAttributes(wrapper);
      return wrapper;
    }
  }

  unwrap(): void {
    if (Object.keys(this.attributes).length) {
      this.replace(InlineBlot.blotName, true);
    } else {
      super.unwrap();
    }
  }
}


export default InlineBlot;
