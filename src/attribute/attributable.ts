import * as Registry from '../registry';


class Attributable {
  domNode;
  attributes;

  attribute(name: string, value: any): void {
    if (value) {
      this.attributes[name] = Registry.match(name);
      this.attributes[name].add(this.domNode, value);
    } else {
      this.attributes[name].remove(this.domNode);
      delete this.attributes[name];
    }
  }

  moveAttributes(target: Attributable): void {
    Object.keys(this.attributes).forEach(key => {
      var value = this.attributes[key].value(this.domNode);
      target.attribute(key, value);
      this.attribute(key, false);
    });
  }
}


export default Attributable;
