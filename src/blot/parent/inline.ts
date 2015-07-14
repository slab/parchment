import Blot from '../blot';
import ParentBlot from './parent';
import * as Registry from '../../registry';
import { ShadowParent } from '../shadow';


class InlineBlot extends ParentBlot {
  static blotName = 'inline';
  static tagName = 'SPAN';

  static compare = function(thisName: string, otherName: string): boolean {
    var thisAttr = Registry.match(thisName, Registry.Type.ATTRIBUTE);
    var otherAttr = Registry.match(otherName, Registry.Type.ATTRIBUTE);
    if (!!thisAttr !== !!otherAttr) {
      return otherAttr;
    }
    return thisName <= otherName;
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    if (this.statics.compare(this.statics.blotName, name)) {
      var formats = this.getFormat();
      if (value && formats[name] === value) return;
      if (!value && !formats[name]) return;
      let target = <Blot>this.isolate(index, length);
      target.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }

  getFormat() {
    var formats = super.getFormat();
    formats[this.statics.blotName] = true;
    return formats;
  }

  unwrap(): void {
    if (Object.keys(this.attributes).length) {
      this.replace(InlineBlot.blotName, true);
    } else {
      super.unwrap();
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
}


export default InlineBlot;
