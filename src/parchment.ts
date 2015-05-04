import ParchmentNode = require('./parchment-node');
import BlockNode = require('./node/block');
import EmbedNode = require('./node/embed');
import InlineNode = require('./node/inline');
import Registry = require('./registry');

import TextNode = require('./node/text')
import BreakNode = require('./node/break');


class Parchment extends ParchmentNode {
  static BlockNode = BlockNode;
  static EmbedNode = EmbedNode;
  static InlineNode = InlineNode;
  static Scope = Registry.Scope;

  static nodeName = 'parchment';
  static tagName = 'DIV';

  static attach(node) {
    return Registry.attach(node);
  }

  static compare(typeName1, typeName2) {
    return Registry.compare(typeName1, typeName2);
  }

  static create(name, value) {
    return Registry.create(name, value);
  }

  static define(nodeClass) {
    return Registry.define(nodeClass);
  }

  static match(node) {
    return Registry.match(node);
  }
}


Parchment.define(Parchment);
Parchment.define(TextNode);
Parchment.define(BlockNode);
Parchment.define(InlineNode);
Parchment.define(BreakNode);


export = Parchment;
