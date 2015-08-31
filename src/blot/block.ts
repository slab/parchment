import FormatBlot from './abstract/format';
import InlineBlot from './inline';
import LeafBlot from './abstract/leaf';
import LinkedList from '../collection/linked-list';
import ParentBlot from './abstract/parent';
import * as Registry from '../registry';


class BlockBlot extends FormatBlot {
  static blotName = 'block';
  static tagName = 'P';

  children: LinkedList<InlineBlot | LeafBlot>;

  format(name: string, value: any): void {
    let blot = Registry.match(name, Registry.Type.BLOT);
    if (blot != null && blot.prototype instanceof BlockBlot) {
      if (value) {
        this.replace(name, value);
      } else {
        this.replace(BlockBlot.blotName, true);
      }
    } else {
      super.format(name, value);
    }
  }

  getLeaves(): LeafBlot[] {
    return this.getDescendants<LeafBlot>(LeafBlot);
  }

  getValue(): (Object | string)[] {
    return [].concat.apply([], this.getLeaves().map(function(leaf) {
      return leaf.getValue();
    }));
  }
}


export default BlockBlot;
