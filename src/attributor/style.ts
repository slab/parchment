import Attributor from './attributor';


class StyleAttribute implements Attributor {
  protected styleName: string;

  constructor(name) {
    this.styleName = name;
  }

  add(node: HTMLElement, value: string) {
    node.style[this.styleName] = value;
  }

  remove(node: HTMLElement) {
    node.style[this.styleName] = '';
    if (!node.getAttribute('style')) {
      node.removeAttribute('style');
    }
  }

  value(node: HTMLElement) {
    return node.style[this.styleName];
  }
}


export default StyleAttribute;
