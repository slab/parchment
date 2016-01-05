import Blot, { Position, DATA_KEY } from './abstract/blot';
import BlockBlot from './block';
import LinkedList from '../collection/linked-list';
import ParentBlot from './abstract/parent';
import * as Registry from '../registry';


const OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true
};

const MAX_CLEAN_ITERATIONS = 10000;


class ContainerBlot extends ParentBlot {
  static blotName = 'container';
  static scope = Registry.Scope.CONTAINER & Registry.Scope.BLOT;
  static tagName = 'DIV';

  children: LinkedList<BlockBlot>;
  observer: MutationObserver;

  constructor(node: Node) {
    super(node);
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      this.update(mutations);
    });
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
  }

  deleteAt(index: number, length: number): void {
    this.update(this.observer.takeRecords());
    super.deleteAt(index, length);
    this.optimize();
  }

  format(name: string, value: any): void {
    this.update(this.observer.takeRecords());
    this.format(name, value);
    this.optimize();
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.update(this.observer.takeRecords());
    super.formatAt(index, length, name, value);
    this.optimize();
  }

  getBlocks(): BlockBlot[] {
    return this.getDescendants<BlockBlot>(BlockBlot);
  }

  getFormat(): any[] {
    return this.getBlocks().map(function(block) {
      return block.getFormat();
    });
  }

  getValue(): any[] {
    return this.getBlocks().map(function(block) {
      return block.getValue();
    });
  }

  insertAt(index: number, value: string, def?: any): void {
    this.update(this.observer.takeRecords());
    super.insertAt(index, value, def);
    this.optimize();
  }

  insertBefore(childBlot: BlockBlot, refBlot?: BlockBlot): void {
    super.insertBefore(childBlot, refBlot);
  }

  optimize(mutations: MutationRecord[] = []): void {
    // TODO use WeakMap
    mutations = mutations.concat(this.observer.takeRecords());
    this.observer.disconnect();
    let mark = (blot: Blot) => {
      if (blot != null && blot != this && blot.domNode[DATA_KEY].mutations == null) {
        blot.domNode[DATA_KEY].mutations = [];
        mark(blot.parent);
      }
    }
    let dirtyBlots = mutations.map(function(mutation: MutationRecord) {
      return Blot.findBlot(mutation.target, true);
    });
    let iterations = 0;
    let traverse = function(blot: Blot): boolean {  // Post-order
      iterations += 1;
      if (iterations >= MAX_CLEAN_ITERATIONS) return true;
      if (blot instanceof ParentBlot) {
        let exit = blot.children.reduce(function(exit, child) {
          if (exit) return exit;
          if (blot.domNode[DATA_KEY].mutations == null) return false;
          return traverse(child);
        }, false);
        if (exit) return exit;
      }
      let blots = blot.optimize();
      if (Array.isArray(blots) && blots.length > 0) {
        dirtyBlots = blots;
        return true;
      }
      return false;
    }
    while (dirtyBlots.length > 0 && iterations <= MAX_CLEAN_ITERATIONS) {
      dirtyBlots.forEach(mark);
      dirtyBlots = [];
      this.children.forEach(traverse);
    }
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
  }

  update(mutations: MutationRecord[]): void {
    // TODO use WeakMap
    mutations.map((mutation: MutationRecord) => {
      let blot = Blot.findBlot(mutation.target, true);
      if (blot == null || blot === this) return null;
      blot.domNode[DATA_KEY].mutations = blot.domNode[DATA_KEY].mutations || [];
      blot.domNode[DATA_KEY].mutations.push(mutation);
      return blot;
    }).forEach((blot: Blot) => {
      if (blot == null || blot.domNode[DATA_KEY].mutations == null) return;
      blot.update(blot.domNode[DATA_KEY].mutations);
      Blot.prototype.optimize.call(blot);
    });
    this.optimize(mutations);
  }
}


export default ContainerBlot;
