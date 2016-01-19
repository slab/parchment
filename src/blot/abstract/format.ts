import Attributor from '../../attributor/attributor';
import { Blot, Parent, Formattable } from './blot';
import ContainerBlot from './container';
import * as Registry from '../../registry';


abstract class FormatBlot extends ContainerBlot implements Formattable {
  protected attributes: AttributorStore;

  build(): void {
    super.build();
    this.attributes = new AttributorStore(this.domNode);
    this.attributes.build();
  }

  format(name: string, value: any): void {
    let attribute = Registry.query(name, Registry.Scope.ATTRIBUTE);
    if (attribute instanceof Attributor) {
      this.attributes.attribute(attribute, value);
    } else if (value) {
      if (name !== this.statics.blotName || this.formats()[name] !== value) {
        this.replaceWith(name, value);
      }
    } else if (name === this.statics.blotName) {
      this.replaceWith(Registry.create(this.statics.scope));
    }
  }

  formats(): { [index: string]: any } {
    let formats = this.attributes.values();
    if ((<any>Registry.query(this.statics.scope)).blotName !== this.statics.blotName) {
      formats[this.statics.blotName] = Array.isArray(this.statics.tagName) ? this.domNode.tagName.toLowerCase() : true;
    }
    return formats;
  }

  formatAt(index: number, length: number, name: string, value: any): void {

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


class AttributorStore {
  attributes: { [key: string]: Attributor } = {};
  domNode: HTMLElement;

  constructor(domNode: HTMLElement) {
    this.domNode = domNode;
  }

  attribute(attribute: Attributor, value: any): void {  // verb
    if (value) {
      if (attribute.add(this.domNode, value)) {
        this.attributes[name] = attribute;
      }
    } else {
      attribute.remove(this.domNode);
      delete this.attributes[name];
    }
  }

  build(): void {
    let attributes = [], classes = [], styles = [];
    [].slice.call(this.domNode.attributes).forEach(item => {
      if (item.name === 'class') {
        classes = item.value.split(/\s+/).map(function(name) {
          return name.split('-').slice(0, -1).join('-');
        });
      } else if (item.name === 'style') {
        styles = item.value.split(';').map(function(val) {
          let arr = val.split(':');
          return arr[0].trim();
        });
      } else {
        attributes.push(item.name);
      }
    });
    attributes.concat(classes).concat(styles).forEach(name => {
      let attr = Registry.query(name, Registry.Scope.ATTRIBUTE);
      if (attr instanceof Attributor) {
        this.attributes[attr.attrName] = attr;
      }
    });
  }

  copy(target: FormatBlot): void {
    Object.keys(this.attributes).forEach(key => {
      let value = this.attributes[key].value(this.domNode);
      target.format(key, value);
    });
  }

  move(target: FormatBlot): void {
    this.copy(target);
    Object.keys(this.attributes).forEach(key => {
      this.attributes[key].remove(this.domNode);
    });
    this.attributes = {};
  }

  values(): Object {
    return Object.keys(this.attributes).reduce((attributes, name) => {
      attributes[name] = this.attributes[name].value(this.domNode);
      return attributes;
    }, {});
  }
}


export default FormatBlot;
