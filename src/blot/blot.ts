import * as Registry from '../registry';
import Attributor from '../attributor/attributor';
import Attributable from '../attributor/attributable';
import { ShadowNode } from './shadow';
import * as Util from '../util';


const DATA_KEY = '__blot_data';


interface Attributors {
  [index: string]: Attributor
}

export interface Position {
  blot: Blot;
  offset: number;
}


class Blot extends ShadowNode implements Attributable {
  static blotName = 'blot';

  static findBlot(node: Node): Blot {
    return node[DATA_KEY];
  }

  prev: Blot;
  next: Blot;
  attributes: Attributors;

  constructor(node: any) {
    if (!(node instanceof Node)) {
      node = document.createElement(this.statics.tagName);
    }
    this.attributes = {};
    this.prev = this.next = null;
    super(node);
    this.domNode[DATA_KEY] = this;
    this.buildAttributes();
  }

  init(): void {
    // Meant for custom blots to overwrite
  }

  remove(): void {
    delete this.domNode[DATA_KEY];
    super.remove();
  }

  formats(): any {
    return Object.keys(this.attributes).reduce((formats, name) => {
      if (this.domNode instanceof HTMLElement) {
        formats[name] = this.attributes[name].value(<HTMLElement>this.domNode);
      }
      return formats;
    }, {});
  }

  values(): any {
    return {};
  }

  deleteAt(index: number, length: number): void {
    var target = this.isolate(index, length);
    target.remove();
  }

  findPath(index: number): Position[] {
    return [{
      blot: this,
      offset: index
    }];
  }

  format(name: string, value: any): void {
    if (typeof Registry.match(name) !== 'function') {
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
  buildAttributes(): void { }
  moveAttributes(target: Attributable): void { }
}
Util.mixin(Blot, [Attributable]);


export default Blot;
