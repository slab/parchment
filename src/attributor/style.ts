import Attributor from './attributor';

function camelize(name: string): string {
  const parts = name.split('-');
  const rest = parts
    .slice(1)
    .map((part: string) => part[0].toUpperCase() + part.slice(1))
    .join('');
  return parts[0] + rest;
}

class StyleAttributor extends Attributor {
  public static keys(node: Element): string[] {
    return (node.getAttribute('style') || '').split(';').map((value) => {
      const arr = value.split(':');
      return arr[0].trim();
    });
  }

  public add(node: HTMLElement, value: string): boolean {
    if (!this.canAdd(node, value)) {
      return false;
    }
    // @ts-ignore
    node.style[camelize(this.keyName)] = value;
    return true;
  }

  public remove(node: HTMLElement): void {
    // @ts-ignore
    node.style[camelize(this.keyName)] = '';
    if (!node.getAttribute('style')) {
      node.removeAttribute('style');
    }
  }

  public value(node: HTMLElement): string {
    // @ts-ignore
    const value = node.style[camelize(this.keyName)];
    return this.canAdd(node, value) ? value : '';
  }
}

export default StyleAttributor;
