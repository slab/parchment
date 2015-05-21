import ParentBlot from './base';
import { merge } from '../../util';
import * as Registry from '../../registry';


class BlockBlot extends ParentBlot {
  static nodeName = 'block';
  static tagName = 'P';
  static scope = Registry.Scope.BLOCK;

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

  deleteAt(index: number, length: number): void {
    super.deleteAt(index, length);
    if (this.children.length === 0) {
      this.appendChild(Registry.create('break'));
    }
  }
}


export default BlockBlot;
