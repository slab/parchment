interface Attribute {
  // static attrName: string;
  // static scope: Registry.Scope;

  add(node: HTMLElement, value: any): void;
  remove(node: HTMLElement): void;
  value(node: HTMLElement): any;
}

export default Attribute;
