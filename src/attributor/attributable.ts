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

  buildAttributes(): void {
    if (!(this.domNode instanceof HTMLElement)) return;

    var attributes = [], classes = [], styles = [];
    Array.prototype.slice.call(this.domNode.attributes).forEach(item => {
      if (item.name === 'class') {
        classes = item.value.split(/\s+/);
      } else if (item.name === 'style') {
        styles = item.value.split(';').map(function(val) {
          var arr = val.split(':');
          return arr[0].trim();
        });
      } else {
        attributes.push(item.name);
      }
    });

    attributes.concat(classes).concat(styles).forEach(name => {
      var attr = Registry.match(name);
      if (attr != null && typeof attr.value === 'function') {  // TODO better check for attribute
        this.attributes[name] = attr;
      }
    });
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
