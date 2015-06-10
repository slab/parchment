import Attributor from './attributor';


class StyleAttribute implements Attributor {
  public attrName: string;
  protected styleKey: string;

  constructor(name, key) {
    this.attrName = name;
    this.styleKey = key;
  }

  add(node: HTMLElement, value: string) {
    node.style[this.styleKey] = value;
  }

  remove(node: HTMLElement) {
    node.style[this.styleKey] = '';
    if (!node.getAttribute('style')) {
      node.removeAttribute('style');
    }
  }

  value(node: HTMLElement) {
    return node.style[this.styleKey];
  }
}


export default StyleAttribute;
