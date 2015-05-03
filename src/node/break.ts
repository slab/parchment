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
    var embedNode = Registry.create('name', textNode);
    this.replace(embedNode);
  }

  insertText(index, text) {
    var textNode = Registry.create('text', textNode);
    this.replace(textNode);
  }
}


export = BreakNode;
