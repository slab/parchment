import ParentBlot from './base';
import * as Registry from '../../registry';


class InlineBlot extends ParentBlot {
  static nodeName = 'inline';
  static tagName = 'SPAN';
  static scope = Registry.Scope.INLINE;

  init(value: any): any {
    if (!(value instanceof HTMLElement)) {
      value = null;
    }
    return super.init(value);
  }

  formats() {
    var format = {};
    format[this.statics.nodeName] = true;
    // TODO add attributes
    return format;
  }

  deleteAt(index: number, length: number): void {
    super.deleteAt(index, length);
    if (this.children.length === 0) {
      this.appendChild(Registry.create('break'));
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    if (Registry.compare(this.statics.nodeName, name) < 0 && value != null) {
      var target = this.isolate(index, length);
      target.wrap(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }
}


export default InlineBlot;
