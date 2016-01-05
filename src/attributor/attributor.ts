import * as Registry from '../registry';


interface AttributorOptions {
  scope?: Registry.Scope;
  whitelist?: string[];
}

class Attributor {
  attrName: string;
  keyName: string;
  scope: Registry.Scope;
  whitelist: string[];

  constructor(attrName: string, keyName: string, options: AttributorOptions = {}) {
    this.attrName = attrName;
    this.keyName = keyName;
    let attributeBit = Registry.Scope.TYPE & Registry.Scope.ATTRIBUTE;
    if (options.scope != null) {
      // Ignore type bits, force attribute bit
      this.scope = (options.scope & Registry.Scope.LEVEL) | attributeBit;
    } else {
      this.scope = Registry.Scope.ATTRIBUTE;
    }
    if (options.whitelist != null) this.whitelist = options.whitelist;
  }

  add(node: HTMLElement, value: string): void {
    node.setAttribute(this.keyName, value);
  }

  canAdd(node: HTMLElement, value: string): boolean {
    let match = Registry.match(node, Registry.Scope.BLOT & (this.scope | Registry.Scope.TYPE));
    if (match != null && (this.whitelist == null || this.whitelist.indexOf(value) > -1)) {
      return true;
    }
    return false;
  }

  remove(node: HTMLElement): void {
    node.removeAttribute(this.keyName);
  }

  value(node: HTMLElement): string {
    return node.getAttribute(this.keyName);
  }
}


export default Attributor;
