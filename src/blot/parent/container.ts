import Blot, { Position } from '../blot';
import Observable from '../observable';
import ParentBlot from './parent';
import * as Registry from '../../registry';


class ContainerBlot extends ParentBlot implements Observable {
  static nodeName = 'container';
  static tagName = 'DIV';

  observer: MutationObserver;

  constructor(value: HTMLElement) {
    super(value);
    this.observer = new MutationObserver(this.observeHandler);
    this.observer.observe(this.domNode, { childList: true });
  }

  findPath(index: number): Position[] {
    return super.findPath(index).slice(1);    // Exclude ourself from result
  }

  getFormat(): any[] {
    return this.children.map(function(child) {
      return child.getFormat();
    });
  }

  getValue(): any[] {
    return this.children.map(function(child) {
      return child.getValue();
    });
  }

  insertAt(index: number, value: string, def?: any): void {
    if (this.children.length === 0) {
      let block = Registry.create('block');
      this.insertBefore(block);
    }
    super.insertAt(index, value, def);
  }

  insertBefore(child: Blot, ref?: Blot): void {
    super.insertBefore(child, ref);
    child.onUpdate = this.onUpdate.bind(this, 'update', child);
  }

  observeHandler(mutations: MutationRecord[]): void {
    mutations.forEach(function(mutation) {
      Array.prototype.slice.call(mutation.removedNodes).forEach(function(node) {
        var blot = Blot.findBlot(node);
        if (blot != null) {
          blot.remove();
        }
      });
      Array.prototype.slice.call(mutation.addedNodes).forEach(node => {
        var refBlot = Blot.findBlot(mutation.nextSibling);
        var blot = Registry.create(node);
        if (blot != null) {
          this.insertBefore(blot, refBlot);
        } else if (node.parentNode != null) {
          node.parentNode.removeChild(node);
        }
      });
    });
    if (mutations.length > 0) {
      this.onUpdate();
    }
    this.observer.takeRecords();  // Ignore changes caused by this handler
  }

  onUpdate(): void {
    // To be overwritten
  }

  update(): boolean {
    var mutations = this.observer.takeRecords();
    this.observeHandler(mutations);
    return mutations.length > 0;
  }
}


export default ContainerBlot;
