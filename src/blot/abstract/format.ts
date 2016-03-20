import Attributor from '../../attributor/attributor';
import AttributorStore from '../../attributor/store';
import { Blot, Parent, Formattable } from './blot';
import ContainerBlot from './container';
import ShadowBlot from './shadow';
import * as Registry from '../../registry';


abstract class FormatBlot extends ContainerBlot implements Formattable {
  protected attributes: AttributorStore;

  static formats(domNode): { [index: string]: any } {
    let formats = {};
    if ((<any>Registry.query(this.scope)).blotName !== this.blotName) {
      formats[this.blotName] = Array.isArray(this.tagName) ? domNode.tagName.toLowerCase() : true;
    }
    return formats;
  }

  attach(): void {
    super.attach();
    this.attributes = new AttributorStore(this.domNode);
  }

  format(name: string, value: any): void {
    let format = Registry.query(name);
    if (format instanceof Attributor) {
      this.attributes.attribute(format, value);
    } else if (value) {
      if (format != null && (name !== this.statics.blotName || this.formats()[name] !== value)) {
        this.replaceWith(name, value);
      }
    } else if (name === this.statics.blotName) {
      this.replaceWith(Registry.create(this.statics.scope));
    }
  }

  formats(): { [index: string]: any } {
    let attributes = this.attributes.values();
    let formats = this.statics.formats(this.domNode);
    Object.keys(formats).forEach(function(key) {
      attributes[key] = formats[key];
    });
    return attributes;
  }

  replaceWith(name: string | Blot, value?: any): Blot {
    let replacement = <FormatBlot>super.replaceWith(name, value);
    this.attributes.copy(replacement);
    return replacement;
  }

  update(mutations: MutationRecord[]): void {
    super.update(mutations);
    if (mutations.some((mutation) => {
      return mutation.target === this.domNode && mutation.type === 'attributes';
    })) {
      this.attributes.build();
    }
  }

  wrap(name: string | Parent, value?: any): Parent {
    let wrapper = super.wrap(name, value);
    if (wrapper instanceof FormatBlot && wrapper.statics.scope === this.statics.scope) {
      this.attributes.move(wrapper);
    }
    return wrapper;
  }
}


export default FormatBlot;
