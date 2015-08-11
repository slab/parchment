import * as Registry from '../registry';
import Attributor from '../attributor/attributor';
import Attributable from '../attributor/attributable';
import ShadowNode from './shadow';
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
    if (node == null) return null;
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
    var mergeTarget = this;
    if (Registry.match(name, Registry.Type.ATTRIBUTE) != null) {
      this.attribute(name, value);
    } else if (Registry.match(name) && value) {
      mergeTarget = <any>this.wrap(name, value);
    }
    if (mergeTarget.prev != null) {
      mergeTarget.prev.merge();
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    var target = <Blot>this.isolate(index, length);
    target.format(name, value);
  }

  getFormat(): any {
    return Object.keys(this.attributes).reduce((formats, name) => {
      if (this.domNode instanceof HTMLElement) {
        formats[name] = this.attributes[name].value(<HTMLElement>this.domNode);
      }
      return formats;
    }, {});
  }

  getValue(): any {
    return {};
  }

  insertAt(index: number, value: string, def?: any): void {
    var target = this.split(index);
    var blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
    this.parent.insertBefore(blot, target);
  }

  merge(target: Blot = this.next): boolean {
    return false;
  }

  remove(): void {
    delete this.domNode[DATA_KEY];
    super.remove();
    if (this.prev != null) {
      this.prev.merge();
    }
  }

  attribute(name: string, value: any): void { }
  buildAttributes(): void { }
  moveAttributes(target: Attributable): void { }
}
Util.mixin(Blot, [Attributable]);


export default Blot;
