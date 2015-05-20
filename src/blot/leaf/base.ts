import Shadow from '../../shadow/base';
import Blot from '../base';
import { Scope } from '../../registry';


class LeafBlot extends Shadow implements Blot {
  static nodeName = 'leaf';
  static scope = Scope.LEAF;

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

  format(name: string, value: any): void {
    this.wrap(name, value);
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.format(name, value);
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


export default LeafBlot;
