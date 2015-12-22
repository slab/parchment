import FormatBlot from './abstract/format';
import InlineBlot from './inline';
import LeafBlot from './abstract/leaf';
import LinkedList from '../collection/linked-list';
import ParentBlot from './abstract/parent';
import * as Registry from '../registry';


type ChildBlot = BlockBlot | InlineBlot | LeafBlot;

class BlockBlot extends FormatBlot {
  static blotName = 'block';
  static scope = Registry.Scope.BLOCK | Registry.Scope.BLOT;
  static tagName = 'P';

  children: LinkedList<ChildBlot>;

  format(name: string, value: any): Blot[] {
    let blot = Registry.match(name, this.statics.scope);
    if (blot != null) {
      if (value) {
        this.replace(name, value);
      } else {
        this.replace(BlockBlot.blotName, true);
      }
      return [this];
    } else {
      return super.format(name, value);
    }
  }

  insertBefore(childBlot: ChildBlot, refBlot?: ChildBlot): void {
    super.insertBefore(childBlot, refBlot);
  }
}


export default BlockBlot;
