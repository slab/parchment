import BlockNode = require('./node/block');
import EmbedNode = require('./node/embed');
import InlineNode = require('./node/inline');
import LeafNode = require('./node/base/leaf');
import ParentNode = require('./node/base/parent');
import ParchmentNode = require('./node/base/parchment');
import Registry = require('./registry');
import Util = require('./lib/util');

import TextNode = require('./node/text')
import BreakNode = require('./node/break');


class Parchment extends ParentNode {
  static BlockNode = BlockNode;
  static EmbedNode = EmbedNode;
  static InlineNode = InlineNode;
  static LeafNode = LeafNode;
  static ParentNode = ParentNode;

  static Scope = Registry.Scope;

  static nodeName = 'parchment';
  static tagName = 'DIV';

  static attach(node: Node): any {
    return Registry.attach(node);
  }

  static compare(typeName1: string, typeName2: string): number {
    return Registry.compare(typeName1, typeName2);
  }

  static create(name: string, value?:any): ParchmentNode {
    return Registry.create(name, value);
  }

  static define(NodeClass, SuperClass = ParentNode): any {
    if (typeof NodeClass !== 'object') {
      return Registry.define(NodeClass);
    } else {
      var SubClass = Util.inherit(NodeClass, SuperClass);
      return Registry.define(SubClass);
    }
  }

  static match(node: Node): ParchmentNode {
    return Registry.match(node);
  }
}


Parchment.define(Parchment);
Parchment.define(TextNode);
Parchment.define(BlockNode);
Parchment.define(InlineNode);
Parchment.define(BreakNode);


export = Parchment;