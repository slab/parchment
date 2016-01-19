import Attributor from '../../attributor/attributor';
import ContainerBlot from './container';
import * as Registry from '../../registry';


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
      let attr = Registry.match(name, Registry.Scope.ATTRIBUTE);
      if (attr != null) {
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


// TODO docs
// adds format() and formats()
class FormatBlot extends ContainerBlot {
  private attributes: AttributorStore;

  static compare(first: string, second: string): number {
    let one = Registry.match(first), two = Registry.match(second);
    let scopeOne = one.scope || one.statics.scope;
    let scopeTwo = two.scope || two.statics.scope;
    if (scopeOne !== scopeTwo) {
      return scopeOne - scopeTwo;
    } else {

    }
  }

  build(): void {
    super.build();
    this.attributes = new AttributorStore(this.domNode);
    this.attributes.build();
  }

  format(name: string, value: any): void {
    let attribute = Registry.match(name, Registry.Scope.ATTRIBUTE);
    if (attribute != null) {
      this.attributes.attribute(attribute, value);
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    let order = FormatBlot.compare(this.statics.blotName, name);
    if (order < 0) {
      let target = <FormatBlot>this.isolate(index, length);
      target.format(name, value);
    } else if (order === 0) {

    } else {
      super.formatAt(index, length, name, value);
    }
  }

  formats(): Object {
    return this.attributes.values();
  }

//   getFormat(): Object {
//     let formats = Object.keys(this.attributes).reduce((formats, name) => {
//       formats[name] = this.attributes[name].value(this.domNode);
//       return formats;
//     }, {});
//     formats[this.statics.blotName] = Array.isArray(this.statics.tagName) ? this.domNode.tagName.toLowerCase() : true;
//     return formats;
//   }

  replaceWith(name: string, value: any): FormatBlot {
    if (name === this.statics.blotName && this.formats()[name] === value) return this;
    let replacement = <FormatBlot>super.replaceWith(name, value);
    this.attributes.copy(replacement);
    return replacement;
  }

  update(mutations: MutationRecord[]): void {
    super.update(mutations);
    mutations.forEach((mutation) => {
      if (mutation.target === this.domNode && mutation.type === 'attributes') {
        this.attributes.build();
      }
    });
  }

  wrap(name: string, value: any): FormatBlot {
    let wrapper = <FormatBlot>super.wrap(name, value);
    if (wrapper !== this && wrapper instanceof FormatBlot && wrapper.statics.scope === this.statics.scope) {
      this.attributes.move(wrapper);
    }
    return wrapper;
  }
}


export { AttributorStore, FormatBlot as default };
