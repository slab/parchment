import Blot from './blot';
import * as Registry from '../registry';


class EmbedBlot extends Blot {
  static blotName = 'embed';

  getValue(): any {
    var value = {};
    value[this.statics.blotName] = true;
    return value;
  }

  insertAt(index: number, value: string, def?: any): void {
    var blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
    var ref = (index === 0) ? this : this.next;
    this.parent.insertBefore(blot, ref);
  }
}


export default EmbedBlot;
