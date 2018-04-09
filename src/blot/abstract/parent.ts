import LinkedList from '../../collection/linked-list';
import * as Registry from '../../registry';
import ShadowBlot from "./shadow";

class ParentBlot extends ShadowBlot {
  static defaultChild: Registry.BlotConstructor | null;
  static allowedChildren: Registry.BlotConstructor[] | null;

  children!: LinkedList<ShadowBlot>;
  domNode!: HTMLElement;

  constructor(domNode: Node) {
    super(domNode);
    this.build();
  }

  appendChild(other: ShadowBlot): void {
    this.insertBefore(other);
  }

  attach(): void {
    super.attach();
    this.children.forEach(child => {
      child.attach();
    });
  }

  build(): void {
    this.children = new LinkedList<ShadowBlot>();
    // Need to be reversed for if DOM nodes already in order
    [].slice
      .call(this.domNode.childNodes)
      .reverse()
      .forEach((node: Node) => {
        try {
          let child = makeAttachedBlot(node);
          this.insertBefore(child, this.children.head || undefined);
        } catch (err) {
          if (err instanceof Registry.ParchmentError) return;
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

  descendant(criteria: { new (): ShadowBlot }, index: number): [ShadowBlot | null, number];
  descendant(
    criteria: (blot: ShadowBlot) => boolean,
    index: number,
  ): [ShadowBlot | null, number];
  descendant(criteria: any, index: number): [ShadowBlot | null, number] {
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
    criteria: typeof ShadowBlot,
    index: number,
    length: number,
  ): ShadowBlot[];
  descendants(
    criteria: (blot: ShadowBlot) => boolean,
    index: number,
    length: number,
  ): ShadowBlot[];
  descendants(
    criteria: any,
    index: number = 0,
    length: number = Number.MAX_VALUE,
  ): ShadowBlot[] {
    let descendants: ShadowBlot[] = [];
    let lengthLeft = length;
    this.children.forEachAt(index, length, function(
      child: ShadowBlot,
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
    this.children.forEach((child: ShadowBlot) => {
      const allowed = this.statics.allowedChildren.some(
        (def: Registry.BlotConstructor) => child instanceof def,
      );
      if (allowed) return;
      if (child.statics.scope === Registry.Scope.BLOCK_BLOT) {
        this.isolate(child.offset(this), child.length());
        child.parent.unwrap();
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
          ? Registry.create('text', value)
          : Registry.create(value, def);
      this.appendChild(blot);
    }
  }

  insertBefore(childBlot: ShadowBlot, refBlot?: ShadowBlot | null): void {
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

  moveChildren(targetParent: ParentBlot, refNode?: ShadowBlot): void {
    this.children.forEach(function(child) {
      targetParent.insertBefore(child, refNode);
    });
  }

  optimize(context: { [key: string]: any }) {
    super.optimize(context);
    this.enforceAllowedChildren();
    if (this.children.length === 0) {
      if (this.statics.defaultChild != null) {
        let child = Registry.create(this.statics.defaultChild.blotName);
        this.appendChild(child);
        child.optimize(context);
      } else {
        this.remove();
      }
    }
  }

  path(index: number, inclusive: boolean = false): [ShadowBlot, number][] {
    let [child, offset] = this.children.find(index, inclusive);
    let position: [ShadowBlot, number][] = [[this, index]];
    if (child instanceof ParentBlot) {
      return position.concat(child.path(offset, inclusive));
    } else if (child != null) {
      position.push([child, offset]);
    }
    return position;
  }

  removeChild(child: ShadowBlot): void {
    this.children.remove(child);
  }

  replaceWith(name: string | ShadowBlot, value?: any): ShadowBlot {
    const replacement =
      typeof name === 'string' ? Registry.create(name, value) : name;
    if (replacement instanceof ParentBlot) {
      this.moveChildren(replacement);
    }
    return super.replaceWith(replacement);
  }

  split(index: number, force: boolean = false): ShadowBlot | null {
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
      let blot = Registry.find(node);
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
        return node.parentNode == this.domNode;
      })
      .sort(function(a, b) {
        if (a === b) return 0;
        if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
          return 1;
        }
        return -1;
      })
      .forEach(node => {
        let refBlot: ShadowBlot | null = null;
        if (node.nextSibling != null) {
          refBlot = Registry.find(node.nextSibling);
        }
        let blot = makeAttachedBlot(node);
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

function makeAttachedBlot(node: Node): ShadowBlot {
  let blot = Registry.find(node);
  if (blot == null) {
    try {
      blot = Registry.create(node);
    } catch (e) {
      blot = Registry.create(Registry.Scope.INLINE);
      [].slice.call(node.childNodes).forEach(function(child: Node) {
        // @ts-ignore
        blot.domNode.appendChild(child);
      });
      if (node.parentNode) {
        node.parentNode.replaceChild(blot.domNode, node);
      }
      blot.attach();
    }
  }
  return blot;
}

export default ParentBlot;
