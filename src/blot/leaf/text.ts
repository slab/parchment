import Blot from '../blot';
import InlineBlot from '../parent/inline';
import ShadowNode from '../shadow';
import * as Registry from '../../registry';

class TextBlot extends Blot {
  static blotName = 'text';

  domNode: Text;
  private text: string;

  constructor(value: string | Node) {
    if (typeof value === 'string') {
      super(document.createTextNode(value));
    } else {
      super(value);
    }
    this.text = this.domNode.data;
  }

  deleteAt(index: number, length: number): void {
    this.text = this.text.slice(0, index) + this.text.slice(index + length);
    this.domNode.data = this.text;
  }

  format(name: string, value: any): void {
    if (Registry.match(name, Registry.Type.ATTRIBUTE) !== null) {
      let target = <InlineBlot>this.wrap(InlineBlot.blotName, true);
      target.format(name, value);
    } else {
      super.format(name, value);
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    var target = <TextBlot>this.isolate(index, length);
    target.format(name, value);
  }

  getValue(): string {
    return this.text;
  }

  insertText(index: number, text: string): void {
    this.text = this.text.slice(0, index) + text + this.text.slice(index);
    this.domNode.data = this.text;
  }

  length(): number {
    return this.text.length;
  }

  split(index: number): ShadowNode {
    if (index === 0) return this;
    if (index === this.length()) return this.next;
    var after = Registry.create(this.statics.blotName, this.domNode.splitText(index));
    this.parent.insertBefore(after, this.next);
    return after;
  }
}


export default TextBlot;
