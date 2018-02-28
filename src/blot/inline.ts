import Attributor from '../attributor/attributor';
import AttributorStore from '../attributor/store';
import { Blot, Parent, Formattable } from './abstract/blot';
import ParentBlot from './abstract/parent';
import LeafBlot from './abstract/leaf';
import ShadowBlot from './abstract/shadow';
import * as Registry from '../registry';

// Shallow object comparison
function isEqual(obj1: Object, obj2: Object): boolean {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  // @ts-ignore
  for (let prop in obj1) {
    // @ts-ignore
    if (obj1[prop] !== obj2[prop]) return false;
  }
  return true;
}

class InlineBlot extends ParentBlot implements Formattable {
  static blotName = 'inline';
  static scope = Registry.Scope.INLINE_BLOT;
  static tagName = 'SPAN';
  protected attributes: AttributorStore;

  static formats(domNode: HTMLElement): any {
    if (domNode.tagName === InlineBlot.tagName) {
      return undefined;
    } else if (typeof this.tagName === 'string') {
      return true;
    } else if (Array.isArray(this.tagName)) {
      return domNode.tagName.toLowerCase();
    }
    return undefined;
  }

  constructor(domNode: Node) {
    super(domNode);
    this.attributes = new AttributorStore(this.domNode);
  }

  format(name: string, value: any) {
    if (name === this.statics.blotName && !value) {
      this.children.forEach(child => {
        if (!(child instanceof InlineBlot)) {
          child = child.wrap(InlineBlot.blotName, true);
        }
        this.attributes.copy(<InlineBlot>child);
      });
      this.unwrap();
    } else {
      let format = Registry.query(name);
      if (format instanceof Attributor) {
        this.attributes.attribute(format, value);
      } else if (value) {
        if (
          format != null &&
          (name !== this.statics.blotName || this.formats()[name] !== value)
        ) {
          this.replaceWith(name, value);
        }
      }
    }
  }

  formats(): { [index: string]: any } {
    let formats = this.attributes.values();
    let format = this.statics.formats(this.domNode);
    if (format != null) {
      formats[this.statics.blotName] = format;
    }
    return formats;
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    if (
      this.formats()[name] != null ||
      Registry.query(name, Registry.Scope.ATTRIBUTE)
    ) {
      let blot = <InlineBlot>this.isolate(index, length);
      blot.format(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }

  optimize(context: { [key: string]: any }): void {
    super.optimize(context);
    let formats = this.formats();
    if (Object.keys(formats).length === 0) {
      return this.unwrap(); // unformatted span
    }
    let next = this.next;
    if (
      next instanceof InlineBlot &&
      next.prev === this &&
      isEqual(formats, next.formats())
    ) {
      next.moveChildren(this);
      next.remove();
    }
  }

  replaceWith(name: string | Blot, value?: any): Blot {
    const replacement = <InlineBlot>super.replaceWith(name, value);
    this.attributes.copy(replacement);
    return replacement;
  }

  update(mutations: MutationRecord[], context: { [key: string]: any }): void {
    super.update(mutations, context);
    if (
      mutations.some(mutation => {
        return (
          mutation.target === this.domNode && mutation.type === 'attributes'
        );
      })
    ) {
      this.attributes.build();
    }
  }

  wrap(name: string | Parent, value?: any): Parent {
    let wrapper = super.wrap(name, value);
    if (
      wrapper instanceof InlineBlot &&
      wrapper.statics.scope === this.statics.scope
    ) {
      this.attributes.move(wrapper);
    }
    return wrapper;
  }
}

export default InlineBlot;
