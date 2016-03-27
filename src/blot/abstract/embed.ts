import { Formattable } from './blot';
import LeafBlot from './leaf';


class EmbedBlot extends LeafBlot implements Formattable {
  static formats(domNode: HTMLElement): { [index: string]: any } {
    return {};
  }

  static value(domNode: HTMLElement): any {
    return null;
  }

  format(name: string, value: any): void {
    // Do nothing by default
  }

  formats(): { [index: string]: any } {
    return this.statics.formats(this.domNode);
  }

  length(): number {
    return 1;
  }

  value(): { [index: string]: any } {
    let value = {};
    value[this.statics.blotName] = this.statics.value(this.domNode) || true;
    return value;
  }
}


export default EmbedBlot;
