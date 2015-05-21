import * as Registry from '../registry';


class Attributable {
  domNode;
  attributes;

  attribute(name: string, value: any): void {
    if (value) {
      this.attributes[name] = Registry.match(name);
      this.attributes[name].add(value);
    } else {
      this.attributes[name].remove(this.domNode);
      delete this.attributes[name];
    }
  }
}


export default Attributable;
