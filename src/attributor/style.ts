import Attributor from './attributor';


class StyleAttributor extends Attributor {
  public attrName: string;
  protected styleName: string;

  constructor(name, key) {
    this.attrName = name;
    this.styleName = key;
    super();
  }

  add(node: HTMLElement, value: string): void {
    node.style[this.styleName] = value;
  }

  remove(node: HTMLElement): void {
    node.style[this.styleName] = '';
    if (!node.getAttribute('style')) {
      node.removeAttribute('style');
    }
  }

  value(node: HTMLElement): string {
    return node.style[this.styleName];
  }
}


export default StyleAttributor;
