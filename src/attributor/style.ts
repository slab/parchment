import Attributor from './attributor';


class StyleAttributor implements Attributor {
  public attrName: string;
  protected styleName: string;

  constructor(name, key) {
    this.attrName = name;
    this.styleName = key;
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


export default StyleAttributor;
