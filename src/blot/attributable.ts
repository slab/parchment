import Attributor from '../attributor/attributor';
import ParentBlot from './parent';
import * as Registry from '../registry';


interface Attributors {
  [index: string]: Attributor;
}


class AttributableBlot extends ParentBlot {
  attributes: Attributors;

  constructor(value) {
    this.attributes = {};
    super(value);
  }

  build(): void {
    super.build();
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
      var attr = Registry.match(name, Registry.Type.ATTRIBUTE);
      if (attr != null) {
        this.attributes[attr.attrName] = attr;
      }
    });
  }

  format(name: string, value: any): void {
    if (Registry.match(name, Registry.Type.ATTRIBUTE) != null) {
      if (value) {
        this.attributes[name] = Registry.match(name, Registry.Type.ATTRIBUTE);
        this.attributes[name].add(this.domNode, value);
      } else if (this.attributes[name] != null) {
        this.attributes[name].remove(this.domNode);
      }
      if (!this.attributes[name].value(this.domNode)) {
        // Add falsy value may end up removing
        delete this.attributes[name];
      }
    } else {
      super.format(name, value);
    }
  }

  getFormat(): Object {
    return Object.keys(this.attributes).reduce((formats, name) => {
      if (this.domNode instanceof HTMLElement) {
        formats[name] = this.attributes[name].value(<HTMLElement>this.domNode);
      }
      return formats;
    }, super.getFormat());
  }

  moveAttributes(target: AttributableBlot) {
    Object.keys(this.attributes).forEach(key => {
      var value = this.attributes[key].value(this.domNode);
      target.format(key, value);
      this.format(key, false);
    });
  }

  replace(name: string, value: any): AttributableBlot {
    var replacement = <AttributableBlot>super.replace(name, value);
    this.moveAttributes(replacement);
    return replacement;
  }
}


export default AttributableBlot;
