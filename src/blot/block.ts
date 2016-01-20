import FormatBlot from './abstract/format';
import * as Registry from '../registry';


class BlockBlot extends FormatBlot {
  static blotName = 'block';
  static scope = Registry.Scope.BLOCK_BLOT;
  static tagName = 'P';

  formatAt(index: number, length: number, name: string, value: any): void {
    if (Registry.query(name, Registry.Scope.BLOCK) != null) {
      this.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }
}


export default BlockBlot;
