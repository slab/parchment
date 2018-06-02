import Registry from '../registry';
import Scope from '../scope';

export interface AttributorOptions {
  scope?: Scope;
  whitelist?: string[];
}

export default class Attributor {
  attrName: string;
  keyName: string;
  scope: Scope;
  whitelist: string[] | undefined;

  static keys(node: HTMLElement): string[] {
    return Array.from(node.attributes).map(function(item: Attr) {
      return item.name;
    });
  }

  constructor(
    attrName: string,
    keyName: string,
    options: AttributorOptions = {},
  ) {
    this.attrName = attrName;
    this.keyName = keyName;
    let attributeBit = Scope.TYPE & Scope.ATTRIBUTE;
    if (options.scope != null) {
      // Ignore type bits, force attribute bit
      this.scope = (options.scope & Scope.LEVEL) | attributeBit;
    } else {
      this.scope = Scope.ATTRIBUTE;
    }
    if (options.whitelist != null) this.whitelist = options.whitelist;
  }

  add(node: HTMLElement, value: string): boolean {
    if (!this.canAdd(node, value)) return false;
    node.setAttribute(this.keyName, value);
    return true;
  }

  canAdd(node: HTMLElement, value: any): boolean {
    if (this.whitelist == null) return true;
    if (typeof value === 'string') {
      return this.whitelist.indexOf(value.replace(/["']/g, '')) > -1;
    } else {
      return this.whitelist.indexOf(value) > -1;
    }
  }

  remove(node: HTMLElement): void {
    node.removeAttribute(this.keyName);
  }

  value(node: HTMLElement): string {
    let value = node.getAttribute(this.keyName);
    if (this.canAdd(node, value) && value) {
      return value;
    }
    return '';
  }
}
