import Registry = require('./registry');
import ShadowNode = require('./shadow-node');


class ParchmentNode extends ShadowNode {
  static nodeName = 'node';
  static scope = Registry.Scope.BLOCK;

  constructor(value) {
    // TODO enforce value being same tag as our definition
    super(value);
    this.build();
  }

  length(): number {
    return this.children.reduce(function(memo, child) {
      return memo + child.length();
    }, 0);
  }

  build(): void {
    var childNodes = Array.prototype.slice.call(this.domNode.childNodes);
    childNodes.forEach((node) => {
      var child = Registry.attach(node);
      if (!!child) {
        this.append(child);
      } else if (!!node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
  }

  deleteText(index: number, length: number): void {
    if (index === 0 && length === this.length()) {
      this.remove();
    } else {
      this.children.forEachAt(index, length, function(child, offset, length) {
        child.deleteText(offset, length);
      });
    }
  }

  formatText(index: number, length: number, name: string, value: any): void {
    if (this.class.nodeName === name) {
      if (!!value) return;
      var target = this.isolate(index, length);
      target.unwrap();
    } else {
      this.children.forEachAt(index, length, function(child, offset, length) {
        child.formatText(offset, length, name, value);
      });
    }
  }

  insertEmbed(index: number, name: string, value: any): void {
    var _arr = this.children.find(index);
    var child = <ParchmentNode>_arr[0], offset = _arr[1];
    child.insertEmbed(offset, name, value);
  }

  insertText(index: number, text: string): void {
    var _arr = this.children.find(index);
    var child = <ParchmentNode>_arr[0], offset = _arr[1];
    child.insertText(offset, text);
  }
}


export = ParchmentNode;
