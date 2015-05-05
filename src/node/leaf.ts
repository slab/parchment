import ParchmentNode = require('../parchment-node');
import Registry = require('../registry');


class LeafNode extends ParchmentNode {
  static nodeName = 'leaf';
  static scope = Registry.Scope.LEAF;

  getLength(): number {
    return 1;
  }

  getFormat(): any[] {
    return [{}];
  }

  getValue(): any[] {
    return [{}];
  }
}


export = LeafNode;
