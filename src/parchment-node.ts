import Registry = require('./registry');
import ShadowNode = require('./shadow-node');


class ParchmentNode extends ShadowNode {
  static nodeName = 'node';
  static scope = Registry.Scope.BLOCK;

  constructor() {
    super();
    this.build();
  }

  length(): number {
    return this.children.reduce(function(memo, child) {
      return memo + child.length();
    }, 0);
  }

  build(): void {
    var childNodes = Array.prototype.slice.call(this.domNode);
    childNodes.forEach(function(node) {
      var child = Registry.attach(node);
      if (!!child) {
        this.append(child);
      } else {
        this.remove();
      }
    });
  }

  deleteText(index: number, length: number): void {
    if (index === 0 && length === this.length()) {
      this.remove()
    } else {
      this.children.forEachAt(index, length, function(child, offset, length) {
        child.deleteText(offset, length);
      });
    }
  }

  formatText(index: number, length: number, name: string, value: string): void {
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
    // TODO fix
    // var [child, offset] = this.children.find(index);
    // child.insertEmbed(offset, name, value);
  }

  insertText(index: number, text: string): void {
    // var [child, offset] = this.children.find(index);
    // child.insertText(offset, text);
  }
}


export = ParchmentNode;
