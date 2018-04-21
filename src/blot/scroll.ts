import { Blot } from './abstract/blot';
import ParentBlot from './abstract/parent';
import ContainerBlot from './abstract/container';
import BlockBlot from './block';
import LinkedList from '../collection/linked-list';
import * as Registry from '../registry';

const OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  characterDataOldValue: true,
  childList: true,
  subtree: true,
};

const MAX_OPTIMIZE_ITERATIONS = 100;

class ScrollBlot extends ParentBlot {
  static blotName = 'scroll';
  static defaultChild = BlockBlot;
  static allowedChildren: Registry.BlotConstructor[] = [
    BlockBlot,
    ContainerBlot,
  ];
  static scope = Registry.Scope.BLOCK_BLOT;
  static tagName = 'DIV';

  observer: MutationObserver;

  constructor(node: HTMLDivElement) {
    super(node);
    this.scroll = this;
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      this.update(mutations);
    });
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
    this.attach();
  }

  detach() {
    super.detach();
    this.observer.disconnect();
  }

  deleteAt(index: number, length: number): void {
    this.update();
    if (index === 0 && length === this.length()) {
      this.children.forEach(function(child) {
        child.remove();
      });
    } else {
      super.deleteAt(index, length);
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.update();
    super.formatAt(index, length, name, value);
  }

  insertAt(index: number, value: string, def?: any): void {
    this.update();
    super.insertAt(index, value, def);
  }

  optimize(context: { [key: string]: any }): void;
  optimize(mutations: MutationRecord[], context: { [key: string]: any }): void;
  optimize(mutations: any = [], context: any = {}): void {
    super.optimize(context);
    const mutationsMap = context.mutationsMap || new WeakMap();
    // We must modify mutations directly, cannot make copy and then modify
    let records = Array.from(this.observer.takeRecords());
    // Array.push currently seems to be implemented by a non-tail recursive function
    // so we cannot just mutations.push.apply(mutations, this.observer.takeRecords());
    while (records.length > 0) mutations.push(records.pop());
    let mark = (blot: Blot | null, markParent: boolean = true) => {
      if (blot == null || blot === this) return;
      if (blot.domNode.parentNode == null) return;
      if (!mutationsMap.has(blot.domNode)) {
        mutationsMap.set(blot.domNode, []);
      }
      if (markParent) mark(blot.parent);
    };
    let optimize = function(blot: Blot) {
      // Post-order traversal
      if (!mutationsMap.has(blot.domNode)) return;
      if (blot instanceof ParentBlot) {
        blot.children.forEach(optimize);
      }
      mutationsMap.delete(blot.domNode);
      blot.optimize(context);
    };
    let remaining = mutations;
    for (let i = 0; remaining.length > 0; i += 1) {
      if (i >= MAX_OPTIMIZE_ITERATIONS) {
        throw new Error('[Parchment] Maximum optimize iterations reached');
      }
      remaining.forEach(function(mutation: MutationRecord) {
        let blot = Registry.find(mutation.target, true);
        if (blot == null) return;
        if (blot.domNode === mutation.target) {
          if (mutation.type === 'childList') {
            mark(Registry.find(mutation.previousSibling, false));
            Array.from(mutation.addedNodes).forEach(function(node: Node) {
              const child = Registry.find(node, false);
              mark(child, false);
              if (child instanceof ParentBlot) {
                child.children.forEach(function(grandChild: Blot) {
                  mark(grandChild, false);
                });
              }
            });
          } else if (mutation.type === 'attributes') {
            mark(blot.prev);
          }
        }
        mark(blot);
      });
      this.children.forEach(optimize);
      remaining = Array.from(this.observer.takeRecords());
      records = remaining.slice();
      while (records.length > 0) mutations.push(records.pop());
    }
  }

  update(
    mutations?: MutationRecord[],
    context: { [key: string]: any } = {},
  ): void {
    mutations = mutations || this.observer.takeRecords();
    const mutationsMap = new WeakMap();
    mutations
      .map(function(mutation: MutationRecord) {
        let blot = Registry.find(mutation.target, true);
        if (blot == null) return null;
        if (mutationsMap.has(blot.domNode)) {
          mutationsMap.get(blot.domNode).push(mutation);
          return null;
        } else {
          mutationsMap.set(blot.domNode, [mutation]);
          return blot;
        }
      })
      .forEach((blot: Blot | null) => {
        if (blot != null && blot !== this && mutationsMap.has(blot.domNode)) {
          blot.update(mutationsMap.get(blot.domNode) || [], context);
        }
      });
    context.mutationsMap = mutationsMap;
    if (mutationsMap.has(this.domNode)) {
      super.update(mutationsMap.get(this.domNode), context);
    }
    this.optimize(mutations, context);
  }
}

export default ScrollBlot;
