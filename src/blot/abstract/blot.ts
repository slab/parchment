import * as Registry from '../../registry';
import ShadowBlot, { ParentBlot } from './shadow';


export const DATA_KEY = '__blot';

interface ShadowStatic {
  blotName: string;
  className: string;
  child?: string | [string, any];
  scope: Registry.Scope;
  tagName: string;
}


abstract class Blot extends ShadowBlot {
  static blotName: string;
  static className: string;
  static tagName: string;

  // TODO: Hack for accessing inherited static methods
  get statics(): ShadowStatic {
    let statics = <any>this.constructor;
    return {
      blotName: statics.blotName,
      child: statics.child,
      className: statics.className,
      scope: statics.scope,
      tagName: statics.tagName
    };
  }

  static create(value: any): Node {
    if (this.tagName == null) {
      throw new Error('[Parchment] Blot definition missing tagName');
    }
    let node;
    if (Array.isArray(this.tagName)) {
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
      node.classList.add(Registry.PREFIX + this.className);
    }
    return node;
  }

  static findBlot(node: Node, bubble: boolean = false): ShadowBlot {
    if (node == null) return null;
    if (node[DATA_KEY] != null) return node[DATA_KEY].blot;
    if (bubble) return this.findBlot(node.parentNode, bubble);
    return null;
  }

  constructor(node: Node) {
    super();
    this.domNode = node;
    this.domNode[DATA_KEY] = { blot: this };
  }

  clone(): Blot {
    let domNode = this.domNode.cloneNode();
    return <Blot>Registry.create(domNode);
  }

  insertInto(parentBlot: ParentBlot, refBlot?: ShadowBlot): void {
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

  isolate(index: number, length: number): ShadowBlot {
    let target = this.split(index);
    target.split(length);
    return target;
  }

  offset(root?: ShadowBlot): number {
    if (this.parent == null || root == this) return 0;
    // TODO rewrite this when we properly define parent as a BlotParent
    if (root == null) {
      return this.parent.children.offset(this);
    } else {
      return this.parent.children.offset(this) + this.parent.offset(root);
    }
  }

  optimize(mutations: MutationRecord[] = []): void {
    delete this.domNode[DATA_KEY].mutations;
  }

  remove(): void {
    if (this.parent == null) return;
    this.parent.children.remove(this);
    if (this.domNode.parentNode != null) {
      this.domNode.parentNode.removeChild(this.domNode);
    }
  }

  replace(target: ShadowBlot): void {
    if (target.parent == null) return;
    this.remove();
    target.parent.insertBefore(this, target.next);
    target.remove();
  }

  replaceWith(name: string, value: any): ParentBlot {
    let replacement = <ParentBlot>Registry.create(name, value);
    replacement.replace(this);
    return replacement;
  }

  split(index: number, force?: boolean): ShadowBlot {
    return index === 0 ? this : this.next;
  }

  wrap(name: string, value: any): ParentBlot {
    let wrapper = <ParentBlot>Registry.create(name, value);
    this.parent.insertBefore(wrapper, this.next);
    wrapper.appendChild(this);
    return wrapper;
  }
}


export default Blot;
