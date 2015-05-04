import ParchmentNode = require('../parchment-node');
import Registry = require('../registry');


class BreakNode extends ParchmentNode {
  static nodeName = 'break';
  static tagName = 'BR';
  static scope = Registry.Scope.LEAF;

  deleteText(index: number, length: number): void {
    // TODO warn
  }

  formatText(index: number, length: number, name: string, value: any): void {
    this.wrap(name, value);
  }

  insertEmbed(index: number, name: string, value: any): void {
    this.replace(name, value);
  }

  insertText(index: number, text: string): void {
    this.replace('text', text);
  }
}


export = BreakNode;
