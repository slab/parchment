import ParchmentNode = require('./parchment');
import Shadow = require('./shadow');


class LeafNode extends Shadow.ShadowNode implements ParchmentNode {
  // formats(): any;
  // values(): any;

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
