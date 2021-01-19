import ParchmentError from '../../error';
import Registry from '../../registry';
import Scope from '../../scope';
import { Blot, BlotConstructor, Formattable, Parent, Root } from './blot';

class ShadowBlot implements Blot {
  public static blotName = 'abstract';
  public static className: string;
  public static requiredContainer: BlotConstructor;
  public static scope: Scope;
  public static tagName: string;

  public static create(value: any): Node {
    if (this.tagName == null) {
      throw new ParchmentError('Blot definition missing tagName');
    }
    let node;
    if (Array.isArray(this.tagName)) {
      if (typeof value === 'string') {
        value = value.toUpperCase();
        if (parseInt(value, 10).toString() === value) {
          value = parseInt(value, 10);
        }
      }
      if (typeof value === 'number') {
        node = document.createElement(this.tagName[value - 1]);
      } else if (this.tagName.indexOf(value) > -1) {
        node = document.createElement(value);
      } else {
        node = document.createElement(this.tagName[0]);
      }
    } else {
      node = document.createElement(this.tagName);
    }
    if (this.className) {
      node.classList.add(this.className);
    }
    return node;
  }

  public prev: Blot | null;
  public next: Blot | null;
  // @ts-ignore
  public parent: Parent;

  // Hack for accessing inherited static methods
  get statics(): any {
    return this.constructor;
  }
  constructor(public scroll: Root, public domNode: Node) {
    Registry.blots.set(domNode, this);
    this.prev = null;
    this.next = null;
  }

  public attach(): void {
    // Nothing to do
  }

  public clone(): Blot {
    const domNode = this.domNode.cloneNode(false);
    return this.scroll.create(domNode);
  }

  public detach(): void {
    if (this.parent != null) {
      this.parent.removeChild(this);
    }
    Registry.blots.delete(this.domNode);
  }

  public deleteAt(index: number, length: number): void {
    const blot = this.isolate(index, length);
    blot.remove();
  }

  public formatAt(
    index: number,
    length: number,
    name: string,
    value: any,
  ): void {
    const blot = this.isolate(index, length);
    if (this.scroll.query(name, Scope.BLOT) != null && value) {
      blot.wrap(name, value);
    } else if (this.scroll.query(name, Scope.ATTRIBUTE) != null) {
      const parent = this.scroll.create(this.statics.scope) as Parent &
        Formattable;
      blot.wrap(parent);
      parent.format(name, value);
    }
  }

  public insertAt(index: number, value: string, def?: any): void {
    const blot =
      def == null
        ? this.scroll.create('text', value)
        : this.scroll.create(value, def);
    const ref = this.split(index);
    this.parent.insertBefore(blot, ref || undefined);
  }

  public isolate(index: number, length: number): Blot {
    const target = this.split(index);
    if (target == null) {
      throw new Error('Attempt to isolate at end');
    }
    target.split(length);
    return target;
  }

  public length(): number {
    return 1;
  }

  public offset(root: Blot = this.parent): number {
    if (this.parent == null || this === root) {
      return 0;
    }
    return this.parent.children.offset(this) + this.parent.offset(root);
  }

  public optimize(_context: { [key: string]: any }): void {
    if (
      this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)
    ) {
      this.wrap(this.statics.requiredContainer.blotName);
    }
  }

  public remove(): void {
    if (this.domNode.parentNode != null) {
      this.domNode.parentNode.removeChild(this.domNode);
    }
    this.detach();
  }

  public replaceWith(name: string | Blot, value?: any): Blot {
    const replacement =
      typeof name === 'string' ? this.scroll.create(name, value) : name;
    if (this.parent != null) {
      this.parent.insertBefore(replacement, this.next || undefined);
      this.remove();
    }
    return replacement;
  }

  public split(index: number, _force?: boolean): Blot | null {
    return index === 0 ? this : this.next;
  }

  public update(
    _mutations: MutationRecord[],
    _context: { [key: string]: any },
  ): void {
    // Nothing to do by default
  }

  public wrap(name: string | Parent, value?: any): Parent {
    const wrapper =
      typeof name === 'string'
        ? (this.scroll.create(name, value) as Parent)
        : name;
    if (this.parent != null) {
      this.parent.insertBefore(wrapper, this.next || undefined);
    }
    if (typeof wrapper.appendChild !== 'function') {
      throw new ParchmentError(`Cannot wrap ${name}`);
    }
    wrapper.appendChild(this);
    return wrapper;
  }
}

export default ShadowBlot;
