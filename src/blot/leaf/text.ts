import Blot from '../blot';
import { ShadowNode } from '../shadow';
import * as Registry from '../../registry';


class TextBlot extends Blot {
  static nodeName = 'text';
  static scope = Registry.Scope.LEAF;

  domNode: Text;

  init(value: any): any {
    if (typeof value === 'string') {
      value = document.createTextNode(value);
    }
    return super.init(value);
  }

  length(): number {
    return this.values().length;
  }

  values(): string {
    return this.domNode.data;
  }

  split(index: number): ShadowNode {
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

  insertText(index: number, text: string): void {
    var curText = this.domNode.data;
    this.domNode.data = curText.slice(0, index) + text + curText.slice(index);
  }
}


export default TextBlot;
