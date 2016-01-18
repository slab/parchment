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

  move(target: FormatBlot): void {
    Object.keys(this.attributes).forEach(key => {
      let value = this.attributes[key].value(this.domNode);
      target.format(key, value);
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
abstract class FormatBlot extends ContainerBlot {
  private attributes: AttributorStore;

  constructor(node: HTMLElement) {
    super(node);
    this.attributes = new AttributorStore(this.domNode);
  }

  build(): void {
    super.build();
    this.attributes.build();
  }

  format(name: string, value: any): void {
    let attribute = Registry.match(name, Registry.Scope.ATTRIBUTE);
    if (attribute != null) {
      this.attributes.attribute(attribute, value);
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

//   moveAttributes(target: FormatBlot): void {
//     Object.keys(this.attributes).forEach(key => {
//       let value = this.attributes[key].value(this.domNode);
//       target.format(key, value);
//       this.format(key, false);
//     });
//   }

//   replaceWith(name: string, value: any): FormatBlot {
//     if (name === this.statics.blotName && this.getFormat()[name] === value) return this;
//     let replacement = <FormatBlot>super.replaceWith(name, value);
//     this.moveAttributes(replacement);
//     return replacement;
//   }

  update(mutations: MutationRecord[]): void {
    super.update(mutations);
    mutations.forEach((mutation) => {
      if (mutation.target === this.domNode && mutation.type === 'attributes') {
        this.attributes.build();
      }
    });
  }

//   wrap(name: string, value: any): ContainerBlot {
//     let wrapper = super.wrap(name, value);
//     if (wrapper !== this && wrapper instanceof FormatBlot && wrapper.statics.scope === this.statics.scope) {
//       this.moveAttributes(wrapper);
//     }
//     return wrapper;
//   }
}


export { AttributorStore, FormatBlot as default };
