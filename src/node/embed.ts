import ParchmentNode = require('../parchment-node');
import Registry = require('../registry');


class EmbedNode extends ParchmentNode {
  static nodeName = 'embed';
  static scope = Registry.Scope.LEAF;

  length(): number {
    return 1;
  }

  formatText(index: number, length: number, name: string, value: any): void {
    this.wrap(name, value);
  }
}


export = EmbedNode;
