import Attributor from '../attributor/attributor';
import { BlotConstructor, Blot, Root } from './abstract/blot';
import ParentBlot from './abstract/parent';
import ContainerBlot from './abstract/container';
import BlockBlot from './block';
import LinkedList from '../collection/linked-list';
import ParchmentError from '../error';
import Registry from '../registry';
import Scope from '../scope';

const OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  characterDataOldValue: true,
  childList: true,
  subtree: true,
};

const MAX_OPTIMIZE_ITERATIONS = 100;

class ScrollBlot extends ParentBlot implements Root {
  static blotName = 'scroll';
  static defaultChild = BlockBlot;
  static allowedChildren: BlotConstructor[] = [BlockBlot, ContainerBlot];
  static scope = Scope.BLOCK_BLOT;
  static tagName = 'DIV';

  registry: Registry;
  observer: MutationObserver;

  constructor(registry: Registry, node: HTMLDivElement) {
    // @ts-ignore
    super(null, node);
    this.registry = registry;
    this.scroll = this;
    this.build();
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      this.update(mutations);
    });
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
    this.attach();
  }

  create(input: Node | string | Scope, value?: any): Blot {
    return this.registry.create(this, input, value);
  }

  find(node: Node | null, bubble: boolean = false): Blot | null {
    return this.registry.find(node, bubble);
  }

  query(
    query: string | Node | Scope,
    scope: Scope = Scope.ANY,
  ): Attributor | BlotConstructor | null {
    return this.registry.query(query, scope);
  }

  register(...Definitions: any[]): any {
    return this.registry.register(...Definitions);
  }

  build() {
    if (this.scroll == null) return;
    super.build();
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
      remaining.forEach((mutation: MutationRecord) => {
        let blot = this.find(mutation.target, true);
        if (blot == null) return;
        if (blot.domNode === mutation.target) {
          if (mutation.type === 'childList') {
            mark(this.find(mutation.previousSibling, false));
            Array.from(mutation.addedNodes).forEach((node: Node) => {
              const child = this.find(node, false);
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
      .map((mutation: MutationRecord) => {
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
