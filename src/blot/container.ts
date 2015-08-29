import BlockBlot from './block';
import LinkedList from '../collection/linked-list';
import ParentBlot from './parent';
import { Position } from './blot';
import * as Registry from '../registry';


class ContainerBlot extends ParentBlot {
  static blotName = 'container';
  static tagName = 'DIV';

  children: LinkedList<BlockBlot | ContainerBlot>;

  findPath(index: number, inclusive: boolean = false): Position[] {
    return super.findPath(index, inclusive).slice(1);    // Exclude ourself from result
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


export default ContainerBlot;
