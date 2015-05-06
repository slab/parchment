import LeafNode = require('./leaf');
import Registry = require('../registry');


// TODO we can define insertText by calling insertText on neighbors


class EmbedNode extends LeafNode {
  static nodeName = 'embed';
  static scope = Registry.Scope.LEAF;

  formatText(index: number, length: number, name: string, value: any): void {
    this.wrap(name, value);
  }

  getLength(): number {
    return 1;
  }

  getValue(): any[] {
    var value = {};
    value[this.class.nodeName] = true;
    return [value];
  }
}


export = EmbedNode;
