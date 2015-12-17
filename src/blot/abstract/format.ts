import Attributor from '../../attributor/attributor';
import ParentBlot from './parent';
import * as Registry from '../../registry';


interface Attributors {
  [index: string]: Attributor;
}


class FormatBlot extends ParentBlot {
  attributes: Attributors;

  build(): void {
    this.attributes = {};
    super.build();
    this.buildAttributes();
  }

  buildAttributes(): void {
    var attributes = [], classes = [], styles = [];
    [].slice.call(this.domNode.attributes).forEach(item => {
      if (item.name === 'class') {
        classes = item.value.split(/\s+/).map(function(name) {
          return name.split('-').slice(0, -1).join('-') || '';
        });
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
    let attribute = Registry.match(name, Registry.Type.ATTRIBUTE);
    if (attribute != null) {
      if (value) {
        this.attributes[name] = attribute;
        this.attributes[name].add(this.domNode, value);
      } else if (this.attributes[name] != null) {
        this.attributes[name].remove(this.domNode);
        delete this.attributes[name];
      }
    } else {
      super.format(name, value);
    }
  }

  getFormat(): Object {
    var formats = Object.keys(this.attributes).reduce((formats, name) => {
      if (this.domNode instanceof HTMLElement) {
        formats[name] = this.attributes[name].value(<HTMLElement>this.domNode);
      }
      return formats;
    }, super.getFormat());
    // TODO fix
    if (['container', 'block', 'inline', 'leaf'].indexOf(this.statics.blotName) < 0) {
      formats[this.statics.blotName] = Array.isArray(this.statics.tagName) ? this.domNode.tagName.toLowerCase() : true;
    }
    return formats;
  }

  moveAttributes(target: FormatBlot) {
    Object.keys(this.attributes).forEach(key => {
      var value = this.attributes[key].value(this.domNode);
      target.format(key, value);
      this.format(key, false);
    });
  }

  replace(name: string, value: any): FormatBlot {
    var replacement = <FormatBlot>super.replace(name, value);
    this.moveAttributes(replacement);
    return replacement;
  }

  update(mutation: MutationRecord) {
    if (mutation.target === this.domNode && mutation.type === 'attributes') {
      this.buildAttributes();
    } else {
      super.update(mutation);
    }
  }
}


export default FormatBlot;
