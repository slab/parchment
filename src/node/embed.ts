import LeafNode = require('./base/leaf');
import Registry = require('../registry');


// TODO we can define insertText by calling insertText on neighbors


class EmbedNode extends LeafNode {
  static nodeName = 'embed';
  static scope = Registry.Scope.LEAF;

  length(): number {
    return 1;
  }

  values(): any {
    var value = {};
    value[this.statics.nodeName] = true;
    return value;
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.wrap(name, value);
  }
}


export = EmbedNode;
