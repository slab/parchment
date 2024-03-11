import Attributor from './attributor.js';

function match(node: HTMLElement, prefix: string): string[] {
  const className = node.getAttribute('class') || '';
  return className
    .split(/\s+/)
    .filter((name) => name.indexOf(`${prefix}-`) === 0);
}

class ClassAttributor extends Attributor {
  public static keys(node: HTMLElement): string[] {
    return (node.getAttribute('class') || '')
      .split(/\s+/)
      .map((name) => name.split('-').slice(0, -1).join('-'));
  }

  public add(node: HTMLElement, value: any): boolean {
    if (!this.canAdd(node, value)) {
      return false;
    }
    this.remove(node);
    node.classList.add(`${this.keyName}-${value}`);
    return true;
  }

  public remove(node: HTMLElement): void {
    const matches = match(node, this.keyName);
    matches.forEach((name) => {
      node.classList.remove(name);
    });
    if (node.classList.length === 0) {
      node.removeAttribute('class');
    }
  }

  public value(node: HTMLElement): any {
    const result = match(node, this.keyName)[0] || '';
    const value = result.slice(this.keyName.length + 1); // +1 for hyphen
    return this.canAdd(node, value) ? value : '';
  }
}

export default ClassAttributor;
