import { Blot, Parent } from './blot';
import * as Registry from '../../registry';


abstract class ShadowBlot implements Blot {
  static blotName = 'abstract';
  static className: string;
  static scope: Registry.Scope;
  static tagName: string;

  prev: Blot;
  next: Blot;
  parent: Parent;

  abstract length(): number;


  // Hack for accessing inherited static methods
  get statics(): any {
    let statics = <any>this.constructor;
    return {
      blotName: statics.blotName,
      childless: statics.childless,
      className: statics.className,
      scope: statics.scope,
      tagName: statics.tagName
    };
  }

  static create(value: any): Node {
    if (this.tagName == null) {
      throw new Registry.ParchmentError('Blot definition missing tagName');
    }
    let node;
    if (Array.isArray(this.tagName)) {
      if (typeof value === 'string' && parseInt(value).toString() === value) {
        value = parseInt(value);
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


  constructor(public domNode: Node) {
    this.attach();
  }

  attach() {
    this.domNode[Registry.DATA_KEY] = { blot: this };
  }

  clone(): Blot {
    let domNode = this.domNode.cloneNode();
    return <Blot>Registry.create(domNode);
  }

  detach() {
    if (this.parent != null) this.parent.children.remove(this);
    delete this.domNode[Registry.DATA_KEY];
  }

  deleteAt(index: number, length: number): void {
    let blot = this.isolate(index, length);
    blot.remove();
  }

  findOffset(node: Node): number {
    return node === this.domNode ? 0 : -1;
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    let blot = this.isolate(index, length);
    blot.wrap(name, value);
  }

  insertAt(index: number, value: string, def?: any): void {
    let blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
    let ref = this.split(index);
    this.parent.insertBefore(blot, ref);
  }

  insertInto(parentBlot: Parent, refBlot?: Blot): void {
    if (this.parent != null) {
      this.parent.children.remove(this);
    }
    parentBlot.children.insertBefore(this, refBlot);
    if (refBlot != null) {
      var refDomNode = refBlot.domNode;
    }
    if (this.next == null || this.domNode.nextSibling != refDomNode) {
      parentBlot.domNode.insertBefore(this.domNode, refDomNode);
    }
    this.parent = parentBlot;
  }

  isolate(index: number, length: number): Blot {
    let target = this.split(index);
    target.split(length);
    return target;
  }

  offset(root: Blot = this.parent): number {
    if (this.parent == null || this == root) return 0;
    return this.parent.children.offset(this) + this.parent.offset(root);
  }

  optimize(): void {
    // TODO clean up
    delete this.domNode[Registry.DATA_KEY].mutations;
  }

  remove(): void {
    if (this.domNode.parentNode != null) {
      this.domNode.parentNode.removeChild(this.domNode);
    }
    this.detach();
  }

  replace(target: Blot): void {
    if (target.parent == null) return;
    target.parent.insertBefore(this, target.next);
    target.remove();
  }

  replaceWith(name: string | Blot, value?: any): Blot {
    let replacement = typeof name === 'string' ? Registry.create(name, value) : name;
    replacement.replace(this);
    return replacement;
  }

  split(index: number, force?: boolean): Blot {
    return index === 0 ? this : this.next;
  }

  update(mutations: MutationRecord[] = []): void {
    // Nothing to do by default
  }

  wrap(name: string | Parent, value?: any): Parent {
    let wrapper = typeof name === 'string' ? <Parent>Registry.create(name, value) : name;
    this.parent.insertBefore(wrapper, this.next);
    wrapper.appendChild(this);
    return wrapper;
  }
}


export default ShadowBlot;
