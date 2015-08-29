import InlineBlot from './inline';
import LeafBlot from './leaf';
import LinkedList from '../collection/linked-list';
import ParentBlot from './parent';
import * as Registry from '../registry';


class BlockBlot extends ParentBlot {
  static blotName = 'block';
  static tagName = 'P';

  children: LinkedList<InlineBlot | LeafBlot> = new LinkedList<InlineBlot | LeafBlot>();

  format(name: string, value: any): void {
    if (Registry.match(name, Registry.Type.ATTRIBUTE) != null) {
      this.attribute(name, value);
    } else {
      let blot = Registry.match(name, Registry.Type.BLOT);
      if (blot != null && blot.prototype instanceof BlockBlot) {
        if (value) {
          this.replace(name, value);
        } else {
          this.replace(BlockBlot.blotName, true);
        }
      }
    }
  }
}


export default BlockBlot;
