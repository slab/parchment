import Blot from './blot';

class LeafBlot extends Blot {
  static blotName = 'leaf';

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
