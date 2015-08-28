class Attributor {
  attrName: string;
  keyName: string;

  constructor(attrName, keyName) {
    this.attrName = attrName;
    this.keyName = keyName;
  }

  add(node: HTMLElement, value: string): void {
    node.setAttribute(this.keyName, value);
  }

  remove(node: HTMLElement): void {
    node.removeAttribute(this.keyName);
  }

  value(node: HTMLElement): string {
    return node.getAttribute(this.keyName);
  }
}

export default Attributor;
