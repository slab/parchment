import ParchmentNode = require('../parchment-node');
import Registry = require('../registry');


class TextNode extends ParchmentNode {
  static nodeName = 'text';
  static scope = Registry.Scope.LEAF;

  constructor() {
    super();
  }
}


export = TextNode;
