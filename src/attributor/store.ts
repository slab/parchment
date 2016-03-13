import Attributor from './attributor';
import { Formattable } from '../blot/abstract/blot';
import * as Registry from '../registry';


class AttributorStore {
  private attributes: { [key: string]: Attributor } = {};
  private domNode: HTMLElement;

  constructor(domNode: HTMLElement) {
    this.domNode = domNode;
    this.build();
  }

  attribute(attribute: Attributor, value: any): void {  // verb
    if (value) {
      if (attribute.add(this.domNode, value)) {
        this.attributes[attribute.attrName] = attribute;
      }
    } else {
      attribute.remove(this.domNode);
      delete this.attributes[attribute.attrName];
    }
  }

  build(): void {
    this.attributes = {};
    let attributes = [], classes = [], styles = [];
    [].slice.call(this.domNode.attributes).forEach((item) => {
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
    attributes.concat(classes).concat(styles).forEach((name) => {
      let attr = Registry.query(name, Registry.Scope.ATTRIBUTE);
      if (attr instanceof Attributor) {
        this.attributes[attr.attrName] = attr;
      }
    });
  }

  copy(target: Formattable): void {
    Object.keys(this.attributes).forEach((key) => {
      let value = this.attributes[key].value(this.domNode);
      target.format(key, value);
    });
  }

  move(target: Formattable): void {
    this.copy(target);
    Object.keys(this.attributes).forEach((key) => {
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


export default AttributorStore;
