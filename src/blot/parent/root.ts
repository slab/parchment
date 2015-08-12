import Blot, { Position } from '../blot';
import BlockBlot from './block';
import LinkedList from '../../collection/linked-list';
import ParentBlot from './parent';
import * as Registry from '../../registry';
import * as Util from '../../util';


class RootBlot extends ParentBlot {
  static blotName = 'root';
  static tagName = 'DIV';

  children: LinkedList<BlockBlot>;

  constructor(value: HTMLElement) {
    super(value);
  }

  findPath(index: number): Position[] {
    return super.findPath(index).slice(1);    // Exclude ourself from result
  }

  getFormat(): any[] {
    return this.children.map(function(child) {
      return child.getFormat();
    });
  }

  getValue(): any[] {
    return this.children.map(function(child) {
      return child.getValue();
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


export default RootBlot;
