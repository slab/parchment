import ParentBlot from './base';
import { merge } from '../../util';
import { Scope } from '../../registry';


class BlockBlot extends ParentBlot {
  static nodeName = 'block';
  static tagName = 'P';
  static scope = Scope.BLOCK;

  formats(): any {
    var collector = function(node): any[] {
      var format = node.formats() || {};
      if (node instanceof ParentBlot) {
        return node.children.reduce(function(memo, child) {
          return memo.concat(collector(child));
        }, []).map(merge.bind(null, format));
      } else {
        return [format];
      }
    };
    return this.children.reduce(function(memo, child) {
      return memo.concat(collector(child));
    }, []);
  }
}


export default BlockBlot;
