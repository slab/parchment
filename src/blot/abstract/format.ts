import Attributor from '../../attributor/attributor';
import ParentBlot from './parent';
import * as Registry from '../../registry';


interface Attributors {
  [index: string]: Attributor;
}

const REQUIRED_BLOTS = ['container', 'block', 'inline', 'leaf'];

class FormatBlot extends ParentBlot {
  attributes: Attributors;

  build(): void {
    this.attributes = {};
    super.build();
    this.buildAttributes();
  }

  buildAttributes(): void {
    let attributes = [], classes = [], styles = [];
    [].slice.call(this.domNode.attributes).forEach(item => {
      if (item.name === 'class') {
        classes = item.value.split(/\s+/).map(function(name) {
          return name.split('-').slice(0, -1).join('-') || '';
        });
      } else if (item.name === 'style') {
        styles = item.value.split(';').map(function(val) {
          let arr = val.split(':');
          return arr[0].trim();
        });
      } else {
        attributes.push(item.name);
      }
    });
    attributes.concat(classes).concat(styles).forEach(name => {
      let attr = Registry.match(name, Registry.Scope.ATTRIBUTE);
      if (attr != null) {
        this.attributes[attr.attrName] = attr;
      }
    });
  }

  format(name: string, value: any): void {
    let attribute = Registry.match(name, Registry.Scope.ATTRIBUTE);
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
    let formats = Object.keys(this.attributes).reduce((formats, name) => {
      if (this.domNode instanceof HTMLElement) {
        formats[name] = this.attributes[name].value(<HTMLElement>this.domNode);
      }
      return formats;
    }, super.getFormat());
    if (REQUIRED_BLOTS.indexOf(this.statics.blotName) < 0) {
      formats[this.statics.blotName] = Array.isArray(this.statics.tagName) ? this.domNode.tagName.toLowerCase() : true;
    }
    return formats;
  }

  moveAttributes(target: FormatBlot): void {
    Object.keys(this.attributes).forEach(key => {
      let value = this.attributes[key].value(this.domNode);
      target.format(key, value);
      this.format(key, false);
    });
  }

  replaceWith(name: string, value: any): FormatBlot {
    let replacement = <FormatBlot>super.replaceWith(name, value);
    this.moveAttributes(replacement);
    return replacement;
  }

  update(mutations: MutationRecord[]): void {
    super.update(mutations);
    mutations.forEach((mutation) => {
      if (mutation.target !== this.domNode) return;
      if (mutation.type === 'attributes') {
        this.buildAttributes();
      }
    });
  }
}


export default FormatBlot;
