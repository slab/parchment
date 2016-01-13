import LeafBlot from './abstract/leaf';
import TextBlot from './text';
import * as Registry from '../registry';


class EmbedBlot extends LeafBlot {
  static blotName = 'embed';

  deleteAt(index: number, length: number): void {
    this.remove();
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.format(name, value);
  }

  getLength(): number {
    return 1;
  }

  getValue(): Object {
    let value = {};
    value[this.statics.blotName] = true;
    return value;
  }

  update(mutations: MutationRecord[]): void { }    // Nothing to do
}


export default EmbedBlot;
