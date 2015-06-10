import Observable from '../observable';
import ParentBlot from './parent';
import { merge } from '../../util';
import * as Registry from '../../registry';


class BlockBlot extends ParentBlot implements Observable {
  static nodeName = 'block';
  static tagName = 'P';

  observer: MutationObserver;

  constructor(value: HTMLElement) {
    super(value);
    this.observer = new MutationObserver(this.observeHandler);
    this.observer.observe(this.domNode, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });
  }

  format(name: string, value: any): void {
    if (Registry.match(name, Registry.Type.ATTRIBUTE) != null) {
      this.attribute(name, value);
    } else if (value) {
      this.replace(name, value);
    } else {
      this.replace(BlockBlot.blotName, true);
    }
  }

  getFormat(): any {
    var collector = function(node): any[] {
      var format = node.getFormat() || {};
      if (node instanceof ParentBlot) {
        return node.children.reduce(function(memo, child) {
          return memo.concat(collector(child));
        }, []).map(merge.bind(null, format));
      } else {
        return [format];
      }
    };
    return this.children.reduce(function(memo, child) {
      return memo.concat(collector(child));
    }, []);
  }

  observeHandler(mutations: MutationRecord[]): void {
    if (mutations.length > 0) {
      this.children.empty();
      this.build();
      this.observer.takeRecords();  // Ignore changes caused by this handler
      this.onUpdate();
    }
  }

  update(): boolean {
    var mutations = this.observer.takeRecords();
    this.observeHandler(mutations);
    return mutations.length > 0;
  }
}


export default BlockBlot;
