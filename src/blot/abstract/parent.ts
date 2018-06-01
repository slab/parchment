import { Blot, BlotConstructor, Leaf, Parent, Root } from './blot';
import LinkedList from '../../collection/linked-list';
import ShadowBlot from './shadow';
import ParchmentError from '../../error';
import Registry from '../../registry';
import Scope from '../../scope';

class ParentBlot extends ShadowBlot implements Parent {
  static defaultChild: BlotConstructor | null;
  static allowedChildren: BlotConstructor[] | null;

  children!: LinkedList<Blot>;
  domNode!: HTMLElement;
  uiNode: HTMLElement | null = null;

  constructor(scroll: Root, domNode: Node) {
    super(scroll, domNode);
    this.build();
  }

  appendChild(other: Blot): void {
    this.insertBefore(other);
  }

  attach(): void {
    super.attach();
    this.children.forEach(child => {
      child.attach();
    });
  }

  attachUI(node: HTMLElement) {
    if (this.uiNode != null) {
      this.uiNode.remove();
    }
    this.uiNode = node;
    this.uiNode.setAttribute('contenteditable', 'false');
    this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
  }

  build(): void {
    this.children = new LinkedList<Blot>();
    // Need to be reversed for if DOM nodes already in order
    Array.from(this.domNode.childNodes)
      .filter((node: Node) => node !== this.uiNode)
      .reverse()
      .forEach((node: Node) => {
        try {
          let child = makeAttachedBlot(node, this.scroll);
          this.insertBefore(child, this.children.head || undefined);
        } catch (err) {
          if (err instanceof ParchmentError) return;
          else throw err;
        }
      });
  }

  deleteAt(index: number, length: number): void {
    if (index === 0 && length === this.length()) {
      return this.remove();
    }
    this.children.forEachAt(index, length, function(child, offset, length) {
      child.deleteAt(offset, length);
    });
  }

  descendant(criteria: { new (): Blot }, index: number): [Blot | null, number];
  descendant(
    criteria: (blot: Blot) => boolean,
    index: number,
  ): [Blot | null, number];
  descendant(criteria: any, index: number = 0): [Blot | null, number] {
    let [child, offset] = this.children.find(index);
    if (
      (criteria.blotName == null && criteria(child)) ||
      (criteria.blotName != null && child instanceof criteria)
    ) {
      return [<any>child, offset];
    } else if (child instanceof ParentBlot) {
      return child.descendant(criteria, offset);
    } else {
      return [null, -1];
    }
  }

  descendants(
    criteria: { new (): Blot },
    index: number,
    length: number,
  ): Blot[];
  descendants(
    criteria: (blot: Blot) => boolean,
    index: number,
    length: number,
  ): Blot[];
  descendants(
    criteria: any,
    index: number = 0,
    length: number = Number.MAX_VALUE,
  ): Blot[] {
    let descendants: Blot[] = [];
    let lengthLeft = length;
    this.children.forEachAt(index, length, function(
      child: Blot,
      index: number,
      length: number,
    ) {
      if (
        (criteria.blotName == null && criteria(child)) ||
        (criteria.blotName != null && child instanceof criteria)
      ) {
        descendants.push(child);
      }
      if (child instanceof ParentBlot) {
        descendants = descendants.concat(
          child.descendants(criteria, index, lengthLeft),
        );
      }
      lengthLeft -= length;
    });
    return descendants;
  }

  detach(): void {
    this.children.forEach(function(child) {
      child.detach();
    });
    super.detach();
  }

  enforceAllowedChildren() {
    let done = false;
    const children = this.children.forEach((child: Blot) => {
      if (done) return;
      const allowed = this.statics.allowedChildren.some(
        (def: BlotConstructor) => child instanceof def,
      );
      if (allowed) return;
      if (child.statics.scope === Scope.BLOCK_BLOT) {
        if (child.next != null) {
          this.splitAfter(child);
        }
        if (child.prev != null) {
          this.splitAfter(child.prev);
        }
        child.parent.unwrap();
        done = true;
      } else if (child instanceof ParentBlot) {
        child.unwrap();
      } else {
        child.remove();
      }
    });
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.children.forEachAt(index, length, function(child, offset, length) {
      child.formatAt(offset, length, name, value);
    });
  }

  insertAt(index: number, value: string, def?: any): void {
    let [child, offset] = this.children.find(index);
    if (child) {
      child.insertAt(offset, value, def);
    } else {
      let blot =
        def == null
          ? this.scroll.create('text', value)
          : this.scroll.create(value, def);
      this.appendChild(blot);
    }
  }

  insertBefore(childBlot: Blot, refBlot?: Blot | null): void {
    if (childBlot.parent != null) {
      childBlot.parent.children.remove(childBlot);
    }
    let refDomNode: Node | null = null;
    this.children.insertBefore(childBlot, refBlot || null);
    if (refBlot != null) {
      refDomNode = refBlot.domNode;
    }
    if (
      this.domNode.parentNode != childBlot.domNode ||
      this.domNode.nextSibling != refDomNode
    ) {
      this.domNode.insertBefore(childBlot.domNode, refDomNode);
    }
    childBlot.parent = this;
    childBlot.attach();
  }

  length(): number {
    return this.children.reduce(function(memo, child) {
      return memo + child.length();
    }, 0);
  }

  moveChildren(targetParent: Parent, refNode?: Blot): void {
    this.children.forEach(function(child) {
      targetParent.insertBefore(child, refNode);
    });
  }

  optimize(context: { [key: string]: any }) {
    super.optimize(context);
    this.enforceAllowedChildren();
    if (this.uiNode != null && this.uiNode !== this.domNode.firstChild) {
      this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
    }
    if (this.children.length === 0) {
      if (this.statics.defaultChild != null) {
        let child = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(child);
        // TODO double check if necessary
        // child.optimize(context);
      } else {
        this.remove();
      }
    }
  }

  path(index: number, inclusive: boolean = false): [Blot, number][] {
    let [child, offset] = this.children.find(index, inclusive);
    let position: [Blot, number][] = [[this, index]];
    if (child instanceof ParentBlot) {
      return position.concat(child.path(offset, inclusive));
    } else if (child != null) {
      position.push([child, offset]);
    }
    return position;
  }

  removeChild(child: Blot): void {
    this.children.remove(child);
  }

  replaceWith(name: string | Blot, value?: any): Blot {
    const replacement =
      typeof name === 'string' ? this.scroll.create(name, value) : name;
    if (replacement instanceof ParentBlot) {
      this.moveChildren(replacement);
    }
    return super.replaceWith(replacement);
  }

  split(index: number, force: boolean = false): Blot | null {
    if (!force) {
      if (index === 0) return this;
      if (index === this.length()) return this.next;
    }
    let after = <ParentBlot>this.clone();
    if (this.parent) {
      this.parent.insertBefore(after, this.next || undefined);
    }
    this.children.forEachAt(index, this.length(), function(
      child,
      offset,
      length,
    ) {
      const split = child.split(offset, force);
      if (split != null) {
        after.appendChild(split);
      }
    });
    return after;
  }

  splitAfter(child: Blot): Parent {
    let after = <ParentBlot>this.clone();
    while (child.next != null) {
      after.appendChild(child.next);
    }
    if (this.parent) {
      this.parent.insertBefore(after, this.next || undefined);
    }
    return after;
  }

  unwrap(): void {
    if (this.parent) {
      this.moveChildren(this.parent, this.next || undefined);
    }
    this.remove();
  }

  update(mutations: MutationRecord[], context: { [key: string]: any }): void {
    let addedNodes: Node[] = [];
    let removedNodes: Node[] = [];
    mutations.forEach(mutation => {
      if (mutation.target === this.domNode && mutation.type === 'childList') {
        addedNodes.push.apply(addedNodes, mutation.addedNodes);
        removedNodes.push.apply(removedNodes, mutation.removedNodes);
      }
    });
    removedNodes.forEach((node: Node) => {
      // Check node has actually been removed
      // One exception is Chrome does not immediately remove IFRAMEs
      // from DOM but MutationRecord is correct in its reported removal
      if (
        node.parentNode != null &&
        // @ts-ignore
        node.tagName !== 'IFRAME' &&
        document.body.compareDocumentPosition(node) &
          Node.DOCUMENT_POSITION_CONTAINED_BY
      ) {
        return;
      }
      let blot = this.scroll.find(node);
      if (blot == null) return;
      if (
        blot.domNode.parentNode == null ||
        blot.domNode.parentNode === this.domNode
      ) {
        blot.detach();
      }
    });
    addedNodes
      .filter(node => {
        return node.parentNode === this.domNode || node === this.uiNode;
      })
      .sort(function(a, b) {
        if (a === b) return 0;
        if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
          return 1;
        }
        return -1;
      })
      .forEach(node => {
        let refBlot: Blot | null = null;
        if (node.nextSibling != null) {
          refBlot = this.scroll.find(node.nextSibling);
        }
        let blot = makeAttachedBlot(node, this.scroll);
        if (blot.next != refBlot || blot.next == null) {
          if (blot.parent != null) {
            blot.parent.removeChild(this);
          }
          this.insertBefore(blot, refBlot || undefined);
        }
      });
    this.enforceAllowedChildren();
  }
}

function makeAttachedBlot(node: Node, scroll: Root): Blot {
  let blot = scroll.find(node);
  if (blot == null) {
    try {
      blot = scroll.create(node);
    } catch (e) {
      blot = <Blot>scroll.create(Scope.INLINE);
      Array.from(node.childNodes).forEach(function(child: Node) {
        // @ts-ignore
        blot.domNode.appendChild(child);
      });
      if (node.parentNode) {
        node.parentNode.replaceChild(blot.domNode, node);
      }
      blot.attach();
    }
  }
  return <Blot>blot;
}

export default ParentBlot;
