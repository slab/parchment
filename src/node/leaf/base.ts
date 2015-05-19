import ParchmentNode = require('./parchment');
import Registry = require('../../registry');
import Shadow = require('./shadow');


class LeafNode extends Shadow.ShadowNode implements ParchmentNode {
  static nodeName = 'leaf';
  static scope = Registry.Scope.LEAF;

  // TODO same code as parent.ts
  init(value: any): any {
    return value || document.createElement(this.statics.tagName);
  }

  formats(): any {
    return null;
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
    throw new Error('LeafNode.deleteAt() should be overwritten.');
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.wrap(name, value);
  }

  insertAt(index: number, value: string, def?: any): void {
    if (def == null) {
      this.insertText(index, value);
    } else {
      this.insertEmbed(index, value, def);
    }
  }

  insertEmbed(index: number, name: string, value: any): void {
    throw new Error('LeafNode.insertEmbed() should be overwritten.');
  }

  insertText(index: number, text: string): void {
    throw new Error('LeafNode.insertText() should be overwritten.');
  }
}


export = LeafNode;
