import * as Registry from '../registry';


interface AttributorOptions {
  scope?: any;
  whitelist?: string[];
}

class Attributor {
  attrName: string;
  keyName: string;
  scope: any;
  whitelist: string[];

  constructor(attrName: string, keyName: string, options: AttributorOptions = {}) {
    this.attrName = attrName;
    this.keyName = keyName;
    if (options.scope != null) this.scope = options.scope;
    if (options.whitelist != null) this.whitelist = options.whitelist;
  }

  add(node: HTMLElement, value: string) {
    node.setAttribute(this.keyName, value);
  }

  canAdd(node: HTMLElement, value: string): boolean {
    if ((this.scope != null && !Registry.match(node, this.scope)) ||
        (this.whitelist != null && this.whitelist.indexOf(value) < 0)) {
      return false;
    }
    return true;
  }

  remove(node: HTMLElement) {
    node.removeAttribute(this.keyName);
  }

  value(node: HTMLElement): string {
    return node.getAttribute(this.keyName);
  }
}

export default Attributor;
