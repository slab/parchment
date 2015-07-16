import Blot from '../blot';
import Mergeable from '../mergeable';
import ParentBlot from './parent';
import * as Registry from '../../registry';
import { ShadowParent } from '../shadow';
import * as util from '../../util';


class InlineBlot extends ParentBlot implements Mergeable {
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

  format(name: string, value: any): void {
    super.format(name, value);
    if (Object.keys(this.getFormat()).length === 0) {
      this.unwrap();
    }
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
    if (this.statics.blotName !== 'inline') {
      formats[this.statics.blotName] = true;
    }
    return formats;
  }

  merge(target: Blot = this.next): boolean {
    if (!this.parent) return false;
    if (target != null &&
        this.statics.blotName === target.statics.blotName &&
        util.isEqual(target.getFormat(), this.getFormat())) {
      (<ParentBlot>target).moveChildren(this);
      target.remove();
      return true;
    }
    return false;
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
