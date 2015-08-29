import BlockBlot from './block';
import LinkedList from '../collection/linked-list';
import ParentBlot from './abstract/parent';
import { Position } from './abstract/blot';
import * as Registry from '../registry';


class ContainerBlot extends ParentBlot {
  static blotName = 'container';
  static tagName = 'DIV';

  children: LinkedList<BlockBlot | ContainerBlot>;

  getBlocks(): BlockBlot[] {
    return this.getDescendants<BlockBlot>(BlockBlot);
  }

  getFormat(): any[] {
    return this.getBlocks().map(function(block) {
      return block.getFormat();
    });
  }

  getValue(): any[] {
    return this.getBlocks().map(function(block) {
      return block.getValue();
    });
  }

  insertAt(index: number, value: string, def?: any): void {
    if (this.children.length === 0) {
      let block = Registry.create('block');
      this.insertBefore(block);
    }
    super.insertAt(index, value, def);
  }
}


export default ContainerBlot;
