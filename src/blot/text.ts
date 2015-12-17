import Blot from './abstract/blot';
import LeafBlot from './abstract/leaf';
import InlineBlot from './inline';
import * as Registry from '../registry';

class TextBlot extends LeafBlot {
  static blotName = 'text';

  domNode: Text;
  private text: string;

  static create(value: string): Text {
    if (typeof value !== 'string') {
      console.trace()
    }
    return document.createTextNode(value);
  }

  constructor(node: Node) {
    super(node);
    this.text = this.domNode.data;
  }

  deleteAt(index: number, length: number): void {
    this.text = this.text.slice(0, index) + this.text.slice(index + length);
    if (this.text.length > 0) {
      this.domNode.data = this.text;
    } else {
      this.remove();
    }
  }

  getLength(): number {
    return this.text.length;
  }

  getValue(): string {
    return this.text;
  }

  insertAt(index: number, value: string, def?: any): void {
    if (def == null) {
      this.text = this.text.slice(0, index) + value + this.text.slice(index);
      this.domNode.data = this.text;
    } else {
      super.insertAt(index, value, def);
    }
  }

  merge(target:Blot = this.next): boolean {
    if (target instanceof TextBlot) {
      this.text = this.text + target.text;
      this.domNode.data = this.text;
      target.remove();
      return true;
    }
    return false;
  }

  split(index: number, force: boolean = false): Blot {
    if (!force) {
      if (index === 0) return this;
      if (index === this.getLength()) return this.next;
    }
    var after = Registry.create(this.domNode.splitText(index));
    this.parent.insertBefore(after, this.next);
    this.text = this.domNode.data;
    return after;
  }

  update(mutation: MutationRecord) {
    if (mutation.type === 'characterData') {
      this.text = this.domNode.data;
    }
  }
}


export default TextBlot;
