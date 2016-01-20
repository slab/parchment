import { Blot, Leaf } from './abstract/blot';
import LeafBlot from './abstract/leaf';
import * as Registry from '../registry';


class TextBlot extends LeafBlot implements Leaf {
  static blotName = 'text';
  static scope = Registry.Scope.INLINE_BLOT;

  public domNode: Text;
  protected text: string;

  static create(value: string): Text {
    return document.createTextNode(value);
  }

  constructor(node: Node) {
    super(node);
    this.text = this.domNode.data;
  }

  deleteAt(index: number, length: number): void {
    this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
  }

  findNode(index: number): [Node, number] {
    return [this.domNode, index];
  }

  insertAt(index: number, value: string, def?: any): void {
    if (def == null) {
      this.text = this.text.slice(0, index) + value + this.text.slice(index);
      this.domNode.data = this.text;
    } else {
      super.insertAt(index, value, def);
    }
  }

  length(): number {
    return this.text.length;
  }

  optimize(): void {
    super.optimize();
    this.text = this.domNode.data;
    if (this.text.length === 0) {
      this.remove();
    } else if (this.next instanceof TextBlot && this.next.prev === this) {
      this.insertAt(this.length(), (<TextBlot>this.next).value());
      this.next.remove();
    }
  }

  split(index: number, force: boolean = false): Blot {
    if (!force) {
      if (index === 0) return this;
      if (index === this.length()) return this.next;
    }
    let after = Registry.create(this.domNode.splitText(index));
    this.parent.insertBefore(after, this.next);
    this.text = this.domNode.data;
    return after;
  }

  update(mutations: MutationRecord[]): void {
    mutations.forEach((mutation) => {
      if (mutation.type === 'characterData' && mutation.target === this.domNode) {
        this.text = this.domNode.data;
      }
    });
  }

  value(): string {
    return this.text;
  }
}


export default TextBlot;
