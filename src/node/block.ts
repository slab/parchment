import LeafNode = require('./base/leaf');
import ParentNode = require('./base/parent');
import Registry = require('../registry');
import Util = require('../lib/util');


// Blocks cannot have other blocks as children


class BlockNode extends ParentNode {
  static nodeName = 'block';
  static tagName = 'P';
  static scope = Registry.Scope.BLOCK;

  formats(): any {
    var collector = function(node): any[] {
      var format = node.formats() || {};
      if (node instanceof ParentNode) {
        return node.children.reduce(function(memo, child) {
          return memo.concat(collector(child));
        }, []).map(Util.merge.bind(null, format));
      } else {
        return [format];
      }
    }
    return this.children.reduce(function(memo, child) {
      return memo.concat(collector(child));
    }, []);
  }
}


export = BlockNode;

