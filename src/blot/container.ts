import Blot, { Position } from './abstract/blot';
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

class ContainerBlot extends ParentBlot {
  static blotName = 'container';
  static scope = Registry.Scope.CONTAINER | Registry.Scope.BLOT;
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

  edit(method, ...params): Blot[] {
    this.observer.disconnect()
    let children = method.apply(this, params) || [];
    children.forEach(function(child: Blot) {
      child.optimize();
    });
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
    return children;
  }

  deleteAt(index: number, length: number): Blot[] {
    return this.edit(super.deleteAt, index, length);
  }

  format(name: string, value: any): Blot[] {
    return this.edit(super.format, name, value);
  }

  formatAt(index: number, length: number, name: string, value: any): Blot[] {
    return this.edit(super.formatAt, index, length, name, value);
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

  insertBefore(childBlot: BlockBlot, refBlot?: BlockBlot): void {
    super.insertBefore(childBlot, refBlot);
  }

  insertAt(index: number, value: string, def?: any): Blot[] {
    return this.edit(super.insertAt, index, value, def);
  }

  update(mutations: MutationRecord);
  update(mutations?: MutationRecord[]);
  update(mutations: any) {
    if (mutations instanceof MutationRecord) {
      return super.update(mutations);
    } else if (mutations == null) {
      mutations = this.observer.takeRecords();
    }
    this.observer.disconnect();
    mutations.forEach((mutation: MutationRecord) => {
      let blot = Blot.findBlot(mutation.target, true);
      if (blot != null) {
        blot.update(mutation);
      }
    });
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
  }
}


export default ContainerBlot;
