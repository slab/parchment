import ParentNode = require('./base/parent');
import Registry = require('../registry');


class BlockNode extends ParentNode {
  static nodeName = 'block';
  static tagName = 'P';
  static scope = Registry.Scope.BLOCK;
}


export = BlockNode;
