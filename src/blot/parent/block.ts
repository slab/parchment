import ParentBlot from './parent';
import * as Util from '../../util';
import * as Registry from '../../registry';


class BlockBlot extends ParentBlot {
  static blotName = 'block';
  static tagName = 'P';

  constructor(value: HTMLElement) {
    super(value);
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

  getFormat(): any {
    var collector = function(node): any[] {
      var format = node.getFormat() || {};
      if (node instanceof ParentBlot) {
        return node.children.reduce(function(memo, child) {
          return memo.concat(collector(child));
        }, []).map(Util.merge.bind(null, format));
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
