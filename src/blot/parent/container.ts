import { Position } from '../blot';
import ParentBlot from './parent';


class ContainerBlot extends ParentBlot {
  static nodeName = 'container';
  static tagName = 'DIV';

  findPath(index: number): Position[] {
    return super.findPath(index).slice(1);    // Exclude ourself from result
  }

  formats(): any[] {
    return this.children.map(function(child) {
      return child.formats();
    });
  }

  values(): any[] {
    return this.children.map(function(child) {
      return child.values();
    });
  }
}


export default ContainerBlot;
