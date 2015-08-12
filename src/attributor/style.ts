import Attributor from './attributor';


class StyleAttributor implements Attributor {
  public attrName: string;
  public keyName: string;

  constructor(name, key) {
    this.attrName = name;
    this.keyName = key;
  }

  add(node: HTMLElement, value: string): void {
    node.style[this.keyName] = value;
  }

  remove(node: HTMLElement): void {
    node.style[this.keyName] = '';
    if (!node.getAttribute('style')) {
      node.removeAttribute('style');
    }
  }

  value(node: HTMLElement): string {
    return node.style[this.keyName];
  }
}


export default StyleAttributor;
