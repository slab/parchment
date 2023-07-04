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
  private styleKey = camelize(this.keyName);

  public static keys(node: HTMLElement): string[] {
    return (node.getAttribute('style') || '').split(';').map((value) => {
      const arr = value.split(':');
      return arr[0].trim();
    });
  }

  public add(node: HTMLElement, value: string): boolean {
    if (!this.canAdd(node, value)) {
      return false;
    }
    node.style.setProperty(this.styleKey, value);
    return true;
  }

  public remove(node: HTMLElement): void {
    node.style.setProperty(this.styleKey, '');
    if (!node.getAttribute('style')) {
      node.removeAttribute('style');
    }
  }

  public value(node: HTMLElement): string {
    const value = node.style.getPropertyValue(this.styleKey);
    return this.canAdd(node, value) ? value : '';
  }
}

export default StyleAttributor;
