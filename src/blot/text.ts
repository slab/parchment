import Blot from './abstract/blot';
import LeafBlot from './abstract/leaf';
import * as Registry from '../registry';


class TextBlot extends LeafBlot {
  static blotName = 'text';

  domNode: Text;
  private text: string;

  static create(value: string): Text {
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

  optimize(): void {
    this.text = this.domNode.data;
    if (this.text.length === 0) {
      this.remove();
    } else if (this.prev instanceof TextBlot) {
      this.prev.insertAt(this.prev.getLength(), this.text);
      this.remove();
    } else {
      super.optimize();
    }
  }

  split(index: number, force: boolean = false): Blot {
    if (!force) {
      if (index === 0) return this;
      if (index === this.getLength()) return this.next;
    }
    let after = Registry.create(this.domNode.splitText(index));
    this.parent.insertBefore(after, this.next);
    this.text = this.domNode.data;
    return after;
  }

  update(mutations: MutationRecord[]): void {
    mutations.forEach((mutation) => {
      if (mutation.target === this.domNode && mutation.type === 'characterData') {
        this.text = this.domNode.data;
      }
    });
  }
}


export default TextBlot;
