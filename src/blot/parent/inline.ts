import Blot from '../blot';
import ParentBlot from './parent';
import { ShadowParent } from '../shadow';
import * as Registry from '../../registry';


class InlineBlot extends ParentBlot {
  static nodeName = 'inline';
  static tagName = 'SPAN';

  formats() {
    var formats = super.formats();
    formats[this.statics.nodeName] = true;
    return formats;
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    if (Registry.compare(this.statics.nodeName, name) < 0) {
      var target = <Blot>this.isolate(index, length);
      target.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }

  wrap(name: string, value: any): ShadowParent {
    if (name === this.statics.nodeName) {
      return this;
    } else if (this.statics.nodeName === InlineBlot.nodeName) {
      return this.replace(name, value);
    } else {
      var wrapper = <ParentBlot>super.wrap(name, value);
      this.moveAttributes(wrapper);
      return wrapper;
    }
  }

  unwrap(): void {
    if (Object.keys(this.attributes).length) {
      this.replace(InlineBlot.nodeName, true);
    } else {
      super.unwrap();
    }
  }
}


export default InlineBlot;
