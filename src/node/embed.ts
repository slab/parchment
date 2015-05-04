import ParchmentNode = require('../parchment-node');
import Registry = require('../registry');


class EmbedNode extends ParchmentNode {
  static nodeName = 'embed';
  static scope = Registry.Scope.LEAF;

  length() {
    return 1;
  }

  formatText(index, length, name, value) {
    this.wrap(name, value);
  }
}


export = EmbedNode;
