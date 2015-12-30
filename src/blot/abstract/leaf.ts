import Blot from './blot';
import * as Registry from '../../registry';


abstract class LeafBlot extends Blot {
  static blotName = 'leaf';
  static scope = Registry.Scope.LEAF & Registry.Scope.BLOT;

  findNode(index: number): [Node, number] {
    return [this.domNode, index];
  }

  getFormat(): Object {
    return {}
  }

  getValue(): Object | string {
    return {}
  }
}

export default LeafBlot;
