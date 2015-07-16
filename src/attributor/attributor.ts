interface Attributor {
  attrName: string;

  add(node: HTMLElement, value: any);
  remove(node: HTMLElement);
  value(node: HTMLElement);
}

export default Attributor;
