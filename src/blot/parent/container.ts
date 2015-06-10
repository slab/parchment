import { Position } from '../blot';
import ParentBlot from './parent';


class ContainerBlot extends ParentBlot {
  static blotName = 'container';
  static tagName = 'DIV';

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
}


export default ContainerBlot;
