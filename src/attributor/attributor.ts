import Scope from '../scope';

export interface AttributorOptions {
  scope?: Scope;
  whitelist?: string[];
}

export default class Attributor {
  public static keys(node: HTMLElement): string[] {
    return Array.from(node.attributes).map((item: Attr) => item.name);
  }

  public scope: Scope;
  public whitelist: string[] | undefined;

  constructor(
    public readonly attrName: string,
    public readonly keyName: string,
    options: AttributorOptions = {},
  ) {
    const attributeBit = Scope.TYPE & Scope.ATTRIBUTE;
    this.scope =
      options.scope != null
        ? // Ignore type bits, force attribute bit
          (options.scope & Scope.LEVEL) | attributeBit
        : Scope.ATTRIBUTE;
    if (options.whitelist != null) {
      this.whitelist = options.whitelist;
    }
  }

  public add(node: HTMLElement, value: any): boolean {
    if (!this.canAdd(node, value)) {
      return false;
    }
    node.setAttribute(this.keyName, value);
    return true;
  }

  public canAdd(_node: HTMLElement, value: any): boolean {
    if (this.whitelist == null) {
      return true;
    }
    if (typeof value === 'string') {
      return this.whitelist.indexOf(value.replace(/["']/g, '')) > -1;
    } else {
      return this.whitelist.indexOf(value) > -1;
    }
  }

  public remove(node: HTMLElement): void {
    node.removeAttribute(this.keyName);
  }

  public value(node: HTMLElement): any {
    const value = node.getAttribute(this.keyName);
    if (this.canAdd(node, value) && value) {
      return value;
    }
    return '';
  }
}
