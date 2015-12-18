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
    this.scope = (options.scope || Registry.Scope.LEVEL) | Registry.Scope.ATTRIBUTE;
    if (options.whitelist != null) this.whitelist = options.whitelist;
  }

  add(node: HTMLElement, value: string) {
    node.setAttribute(this.keyName, value);
  }

  canAdd(node: HTMLElement, value: string): boolean {
    if ((Registry.match(node, Registry.Scope.BLOT | this.scope) == null) ||
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
