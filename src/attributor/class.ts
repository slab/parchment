import Attributor from './attributor';

function match(node: HTMLElement, prefix: string): string[] {
  return node.className.split(/\s+/).filter(function(name) {
    return name.indexOf(`${prefix}-`) === 0;
  });
}

class ClassAttributor extends Attributor {
  attrName: string;
  keyName: string;

  add(node: HTMLElement, value: string) {
    this.remove(node);
    node.classList.add(`${this.keyName}-${value}`);
  }

  remove(node: HTMLElement) {
    let matches = match(node, this.keyName);
    matches.forEach(function(name) {
      node.classList.remove(name);
    });
    if (node.classList.length === 0) {
      node.removeAttribute('class');
    }
  }

  value(node: HTMLElement): string {
    let result = match(node, this.keyName)[0] || '';
    return result.slice(this.keyName.length + 1);  // +1 for hyphen
  }
}


export default ClassAttributor;
