import LeafBlot from './base';
import { Scope } from '../../registry';


// TODO we can define insertText by calling insertText on neighbors

class EmbedBlot extends LeafBlot {
  static nodeName = 'embed';
  static scope = Scope.LEAF;

  length(): number {
    return 1;
  }

  values(): any {
    var value = {};
    value[this.statics.nodeName] = true;
    return value;
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.wrap(name, value);
  }
}


export default EmbedBlot;
