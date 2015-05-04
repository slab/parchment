import ParchmentNode = require('../parchment-node');
import Registry = require('../registry');


class BreakNode extends ParchmentNode {
  static nodeName = 'break';
  static tagName = 'BR';
  static scope = Registry.Scope.LEAF;

  formatText(index, length, name, value) {
    this.wrap(name, value);
  }

  insertEmbed(index, name, value) {
    this.replace(name, value);
  }

  insertText(index, text) {
    this.replace('text', text);
  }
}


export = BreakNode;
