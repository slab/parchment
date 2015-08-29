import LeafBlot from './abstract/leaf';
import * as Registry from '../registry';


class EmbedBlot extends LeafBlot {
  static blotName = 'embed';

  getValue(): Object {
    var value = super.getValue();
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
