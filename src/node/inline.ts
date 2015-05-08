import ParentNode = require('./base/parent');
import Registry = require('../registry');


class InlineNode extends ParentNode {
  static nodeName = 'inline';
  static tagName = 'SPAN';
  static scope = Registry.Scope.INLINE;

  init(value: any): any {
    if (!(value instanceof HTMLElement)) {
      value = null;
    }
    return super.init(value);
  }

  deleteAt(index: number, length: number): void {
    super.deleteAt(index, length);
    if (this.children.length === 0) {
      this.appendChild(Registry.create('break'));
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    if (Registry.compare(this.statics.nodeName, name) < 0 && !!value) {
      var target = this.isolate(index, length);
      target.wrap(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }
}


export = InlineNode;
