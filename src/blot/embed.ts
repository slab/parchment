import type { Formattable, Root } from './abstract/blot.js';
import LeafBlot from './abstract/leaf.js';

class EmbedBlot extends LeafBlot implements Formattable {
  public static formats(_domNode: HTMLElement, _scroll: Root): any {
    return undefined;
  }

  public format(name: string, value: any): void {
    // super.formatAt wraps, which is what we want in general,
    // but this allows subclasses to overwrite for formats
    // that just apply to particular embeds
    super.formatAt(0, this.length(), name, value);
  }

  public formatAt(
    index: number,
    length: number,
    name: string,
    value: any,
  ): void {
    if (index === 0 && length === this.length()) {
      this.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }

  public formats(): { [index: string]: any } {
    return this.statics.formats(this.domNode, this.scroll);
  }
}

export default EmbedBlot;
