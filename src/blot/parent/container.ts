import ParentBlot from './parent';
import { Scope } from '../../registry';


class ContainerBlot extends ParentBlot {
  static nodeName = 'container';
  static tagName = 'DIV';
  static scope = Scope.CONTAINER;

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
