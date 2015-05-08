import ParchmentNode = require('./parchment');
import Registry = require('../../registry');
import Shadow = require('./shadow');


class LeafNode extends Shadow.ShadowNode implements ParchmentNode {
  static nodeName = 'leaf';
  static scope = Registry.Scope.LEAF;

  // formats(): any;

  // TODO same code as parent.ts
  init(value: any): any {
    return value || document.createElement(this.statics.tagName);
  }

  length(): number {
    var value = this.values();
    if (typeof value === 'string') {
      return value.length;
    } else {
      return 1;
    }
  }

  values(): any {
    return {};
  }

  deleteAt(index: number, length: number): void {
    // TODO warn
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.wrap(name, value);
  }

  insertAt(index: number, value: string, def?: any): void {
    if (!!def) {
      this.insertEmbed(index, value, def);
    } else {
      this.insertText(index, value);
    }
  }

  insertEmbed(index: number, name: string, value: any): void {
    // TODO warn
  }

  insertText(index: number, text: string): void {
    // TODO warn
  }
}


export = LeafNode;
