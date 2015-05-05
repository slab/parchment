import LeafNode = require('./leaf');
import Registry = require('../registry');


class EmbedNode extends LeafNode {
  static nodeName = 'embed';
  static scope = Registry.Scope.LEAF;

  formatText(index: number, length: number, name: string, value: any): void {
    this.wrap(name, value);
  }

  getLength(): number {
    return 1;
  }

  getFormat(): any[] {
    return [{}];
  }

  getValue(): any[] {
    var value = {};
    value[this.class.nodeName] = true;
    return [value];
  }
}


export = EmbedNode;
