import Blot from '../blot';
import ParentBlot from './parent';
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

  format(name: string, value: any): void {
    if (Registry.match(name)) {
      this.attribute(name, value);
    } else if (value) {
      this.replace(name, value);
    } else {
      this.replace('block', true);
    }
  }

  replace(name: string, value: any): Blot {
    if (name === this.statics.nodeName) {
      return this;
    }
    return super.replace(name, value);
  }
}


export default BlockBlot;
