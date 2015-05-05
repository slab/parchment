import ParchmentNode = require('../parchment-node');
import Registry = require('../registry');
import ShadowNode = require('../shadow-node');


class TextNode extends ParchmentNode {
  static nodeName = 'text';
  static scope = Registry.Scope.LEAF;

  domNode: Text;

  constructor(value, NodeClass) {
    if (value instanceof String) {
      value = document.createTextNode(value);
    }
    super(value, NodeClass);
  }

  length(): number {
    return this.domNode.data.length;
  }

  split(index: number): ShadowNode {
    if (index === 0) return this;
    if (index === this.length()) return this.next;
    var after = Registry.create(this.class.nodeName, this.domNode.splitText(index));
    this.parent.insertBefore(after, this.next);
    return after;
  }

  deleteText(index: number, length: number): void {
    var curText = this.domNode.data;
    this.domNode.data = curText.slice(0, index) + curText.slice(index + length);
  }

  formatText(index: number, length: number, name: string, value: string): void {
    var target = this.isolate(index, length);
    target.wrap(name, value);
  }

  insertEmbed(index: number, name: string, value: string): void {
    this.split(index);
    var embed = Registry.create(name, value);
    this.parent.insertBefore(embed, this.next);
  }

  insertText(index: number, text: string): void {
    var curText = this.domNode.data;
    this.domNode.data = curText.slice(0, index) + text + curText.slice(index);
  }
}


export = TextNode;
