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
  private styleKey = assertValidStyleKey(camelize(this.keyName));
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
    node.style[this.styleKey] = value;
    return true;
  }

  public remove(node: HTMLElement): void {
    node.style[this.styleKey] = '';
    if (!node.getAttribute('style')) {
      node.removeAttribute('style');
    }
  }

  public value(node: HTMLElement): string {
    const value = node.style[this.styleKey];
    return this.canAdd(node, value) ? value : '';
  }
}

function assertValidStyleKey(k: string): ValidStyleKeys {
  if (!(k in document.documentElement.style)) {
    throw new Error(`Invalid keyName ${k} for css style`);
  }
  return k as ValidStyleKeys;
}

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types
type DistributiveCheck<Keys> = Keys extends keyof CSSStyleDeclaration
  ? // Distribute union type parameter with `A extends B ? ... : never` conditional
    CSSStyleDeclaration[Keys] extends string
    ? Keys
    : never
  : never;

type ValidStyleKeys = Exclude<
  DistributiveCheck<keyof CSSStyleDeclaration>,
  number
>;

export default StyleAttributor;
