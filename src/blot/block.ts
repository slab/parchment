import Attributor from '../attributor/attributor';
import AttributorStore from '../attributor/store';
import { Blot, Parent, Formattable } from './abstract/blot';
import ParentBlot from './abstract/parent';
import ShadowBlot from './abstract/shadow';
import LeafBlot from './abstract/leaf';
import InlineBlot from './inline';
import * as Registry from '../registry';

class BlockBlot extends ParentBlot implements Formattable {
  static allowedChildren: Registry.BlotConstructor[] = [
    InlineBlot,
    BlockBlot,
    LeafBlot,
  ];
  static blotName = 'block';
  static scope = Registry.Scope.BLOCK_BLOT;
  static tagName = 'P';
  protected attributes: AttributorStore;

  static formats(domNode: HTMLElement): any {
    const tagName = (<any>Registry.query(BlockBlot.blotName)).tagName;
    if (domNode.tagName === tagName) {
      return undefined;
    } else if (typeof this.tagName === 'string') {
      return true;
    } else if (Array.isArray(this.tagName)) {
      return domNode.tagName.toLowerCase();
    }
  }

  constructor(domNode: Node) {
    super(domNode);
    this.attributes = new AttributorStore(this.domNode);
  }

  format(name: string, value: any) {
    const format = Registry.query(name, Registry.Scope.BLOCK);
    if (format == null) {
      return;
    } else if (format instanceof Attributor) {
      this.attributes.attribute(format, value);
    } else if (name === this.statics.blotName && !value) {
      this.replaceWith(BlockBlot.blotName);
    } else if (
      value &&
      (name !== this.statics.blotName || this.formats()[name] !== value)
    ) {
      this.replaceWith(name, value);
    }
  }

  formats(): { [index: string]: any } {
    const formats = this.attributes.values();
    const format = this.statics.formats(this.domNode);
    if (format != null) {
      formats[this.statics.blotName] = format;
    }
    return formats;
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    if (Registry.query(name, Registry.Scope.BLOCK) != null) {
      this.format(name, value);
    }
    super.formatAt(index, length, name, value);
  }

  insertAt(index: number, value: string, def?: any): void {
    if (def == null || Registry.query(value, Registry.Scope.INLINE) != null) {
      // Insert text or inline
      super.insertAt(index, value, def);
    } else {
      const after = this.split(index);
      if (after != null) {
        const blot = Registry.create(value, def);
        after.parent.insertBefore(blot, after);
      } else {
        throw new Error('Attempt to insertAt after block boundaries');
      }
    }
  }

  replaceWith(name: string | Blot, value?: any): Blot {
    const replacement = <BlockBlot>super.replaceWith(name, value);
    this.attributes.copy(replacement);
    return replacement;
  }

  update(mutations: MutationRecord[], context: { [key: string]: any }): void {
    super.update(mutations, context);
    const attributeChanged = mutations.some(
      mutation =>
        mutation.target === this.domNode && mutation.type === 'attributes',
    );
    if (attributeChanged) {
      this.attributes.build();
    }
  }
}

export default BlockBlot;
