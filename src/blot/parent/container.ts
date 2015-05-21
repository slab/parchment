import ParentBlot from './parent';


class ContainerBlot extends ParentBlot {
  static nodeName = 'container';
  static tagName = 'DIV';

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
