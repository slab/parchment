import * as Registry from '../registry';
import Attributable from '../attribute/attributable';
import { ShadowNode } from './shadow';
import { mixin } from '../util';


class Blot extends ShadowNode implements Attributable {
  static nodeName = 'blot';

  prev: Blot = null;
  next: Blot = null;
  attributes = {};

  init(value: any): any {
    if (!(value instanceof Node)) {
      value = document.createElement(this.statics.tagName);
    }
    return super.init(value);
  }

  formats(): any {
    return null;
  }

  values(): any {
    return {};
  }

  deleteAt(index: number, length: number): void {
    var target = this.isolate(index, length);
    target.remove();
  }

  format(name: string, value: any): void {
    if (Registry.type(name) === Registry.Type.ATTRIBUTE) {
      this.attribute(name, value);
    } else if (value) {
      this.wrap(name, value);
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    var target = <Blot>this.isolate(index, length);
    target.format(name, value);
  }

  insertAt(index: number, value: string, def?: any): void {
    var target = this.split(index);
    var blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
    this.parent.insertBefore(blot, target);
  }

  attribute(name: string, value: any): void { }
}
mixin(Blot, [Attributable]);


export default Blot;
