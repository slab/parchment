import ParentBlot from './parent';
import * as Util from '../../util';
import * as Registry from '../../registry';


class BlockBlot extends ParentBlot {
  static blotName = 'block';
  static tagName = 'P';

  constructor(value: HTMLElement) {
    super(value);
  }

  format(name: string, value: any): void {
    if (Registry.match(name, Registry.Type.ATTRIBUTE) != null) {
      this.attribute(name, value);
    } else if (value) {
      this.replace(name, value);
    } else {
      this.replace(BlockBlot.blotName, true);
    }
  }
}


export default BlockBlot;
