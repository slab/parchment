import LeafBlot from './base';
import Shadow from '../../shadow/base';
import * as Registry from '../../registry';


class TextBlot extends LeafBlot {
  static nodeName = 'text';
  static scope = Registry.Scope.LEAF;

  domNode: Text;

  init(value: any): any {
    if (value instanceof String) {
      value = document.createTextNode(value);
    }
    return super.init(value);
  }

  values(): string {
    return this.domNode.data;
  }

  split(index: number): Shadow {
    if (index === 0) return this;
    if (index === this.length()) return this.next;
    var after = Registry.create(this.statics.nodeName, this.domNode.splitText(index));
    this.parent.insertBefore(after, this.next);
    return after;
  }

  deleteAt(index: number, length: number): void {
    var curText = this.domNode.data;
    this.domNode.data = curText.slice(0, index) + curText.slice(index + length);
  }

  formatAt(index: number, length: number, name: string, value: string): void {
    var target = this.isolate(index, length);
    target.wrap(name, value);
  }

  insertEmbed(index: number, name: string, value: any): void {
    this.split(index);
    var embed = Registry.create(name, value);
    this.parent.insertBefore(embed, this.next);
  }

  insertText(index: number, text: string): void {
    var curText = this.domNode.data;
    this.domNode.data = curText.slice(0, index) + text + curText.slice(index);
  }
}


export default TextBlot;
