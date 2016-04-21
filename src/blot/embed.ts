import { Formattable } from './abstract/blot';
import LeafBlot from './abstract/leaf';


class EmbedBlot extends LeafBlot implements Formattable {
  static formats(domNode: HTMLElement): any {
    return undefined;
  }

  format(name: string, value: any): void {
    // Do nothing by default
  }

  formats(): { [index: string]: any } {
    return this.statics.formats(this.domNode);
  }
}


export default EmbedBlot;
