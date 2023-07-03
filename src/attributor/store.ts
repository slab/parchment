import type { Formattable } from '../blot/abstract/blot';
import Registry from '../registry';
import Scope from '../scope';
import Attributor from './attributor';
import ClassAttributor from './class';
import StyleAttributor from './style';

class AttributorStore {
  private attributes: { [key: string]: Attributor } = {};
  private domNode: HTMLElement;

  constructor(domNode: HTMLElement) {
    this.domNode = domNode;
    this.build();
  }

  public attribute(attribute: Attributor, value: any): void {
    // verb
    if (value) {
      if (attribute.add(this.domNode, value)) {
        if (attribute.value(this.domNode) != null) {
          this.attributes[attribute.attrName] = attribute;
        } else {
          delete this.attributes[attribute.attrName];
        }
      }
    } else {
      attribute.remove(this.domNode);
      delete this.attributes[attribute.attrName];
    }
  }

  public build(): void {
    this.attributes = {};
    const blot = Registry.find(this.domNode);
    if (blot == null) {
      return;
    }
    const attributes = Attributor.keys(this.domNode);
    const classes = ClassAttributor.keys(this.domNode);
    const styles = StyleAttributor.keys(this.domNode);
    attributes
      .concat(classes)
      .concat(styles)
      .forEach((name) => {
        const attr = blot.scroll.query(name, Scope.ATTRIBUTE);
        if (attr instanceof Attributor) {
          this.attributes[attr.attrName] = attr;
        }
      });
  }

  public copy(target: Formattable): void {
    Object.keys(this.attributes).forEach((key) => {
      const value = this.attributes[key].value(this.domNode);
      target.format(key, value);
    });
  }

  public move(target: Formattable): void {
    this.copy(target);
    Object.keys(this.attributes).forEach((key) => {
      this.attributes[key].remove(this.domNode);
    });
    this.attributes = {};
  }

  public values(): { [key: string]: any } {
    return Object.keys(this.attributes).reduce(
      (attributes: { [key: string]: any }, name: string) => {
        attributes[name] = this.attributes[name].value(this.domNode);
        return attributes;
      },
      {},
    );
  }
}

export default AttributorStore;
