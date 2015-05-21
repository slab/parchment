import * as Registry from '../registry';
import { ShadowNode } from './shadow';


class Blot extends ShadowNode {
  static nodeName = 'base';
  static scope = Registry.Scope.LEAF;

  prev: Blot = null;
  next: Blot = null;

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
    this.wrap(name, value);
  }

  insertAt(index: number, value: string, def?: any): void {
    var target = this.split(index);
    var blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
    this.parent.insertBefore(blot, target);
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    var target = <Blot>this.isolate(index, length);
    target.format(name, value);
  }
}


export default Blot;
