import Blot from '../blot';
import InlineBlot from '../parent/inline';
import { ShadowNode } from '../shadow';
import * as Registry from '../../registry';


class TextBlot extends Blot {
  static nodeName = 'text';

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

  format(name: string, value: any): void {
    if (typeof Registry.match(name) !== 'function') {
      var target = <InlineBlot>this.wrap(InlineBlot.nodeName, true);
      target.format(name, value);
    } else {
      super.format(name, value);
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    var target = <TextBlot>this.isolate(index, length);
    target.format(name, value);
  }

  insertText(index: number, text: string): void {
    var curText = this.domNode.data;
    this.domNode.data = curText.slice(0, index) + text + curText.slice(index);
  }
}


export default TextBlot;
