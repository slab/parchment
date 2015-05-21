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

  formatAt(index: number, length: number, name: string, value: any): void {
    if (Registry.compare(this.statics.nodeName, name) < 0 && value != null) {
      var target = <ParentBlot>this.isolate(index, length);  // TODO this is not necessarily true
      target.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }
}


export default InlineBlot;
