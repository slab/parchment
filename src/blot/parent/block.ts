import ParentBlot from './parent';
import { merge } from '../../util';
import * as Registry from '../../registry';


class BlockBlot extends ParentBlot {
  static blotName = 'block';
  static tagName = 'P';

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

  format(name: string, value: any): void {
    if (Registry.match(name, Registry.Type.ATTRIBUTE) != null) {
      this.attribute(name, value);
    } else if (value) {
      this.replace(name, value);
    } else {
      this.replace(BlockBlot.blotName, true);
    }
  }
}


export default BlockBlot;
