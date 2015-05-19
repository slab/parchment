import BlockBlot from './blot/parent/block';
import EmbedBlot from './blot/leaf/embed';
import LeafBlot from './blot/leaf/base';
import InlineBlot from './blot/parent/inline';
import ParentBlot from './blot/parent/base';

import Blot from './blot/base';
import { inherit } from './util';

import TextBlot from './blot/leaf/text';
import BreakBlot from './blot/leaf/break';

import * as Registry from './registry';


class Parchment extends ParentBlot {
  static Block = BlockBlot;
  static Embed = EmbedBlot;
  static Inline = InlineBlot;
  static Leaf = LeafBlot;
  static Parent = ParentBlot;

  static Scope = Registry.Scope;

  static nodeName = 'parchment';
  static tagName = 'DIV';
  static scope = Registry.Scope.CONTAINER;


  static compare(typeName1: string, typeName2: string): number {
    return Registry.compare(typeName1, typeName2);
  }

  static create(name: string, value?:any): Blot {
    return Registry.create(name, value);
  }

  static define(NodeClass, SuperClass = ParentBlot): any {
    if (typeof NodeClass !== 'object') {
      return Registry.define(NodeClass);
    } else {
      var SubClass = inherit(NodeClass, SuperClass);
      return Registry.define(SubClass);
    }
  }

  static match(node: Node): Blot {
    return Registry.match(node);
  }

  formats(): any[] {
    return this.children.map(function(child) {
      return child.formats();
    });
  }

  values(): any[] {
    return this.children.map(function(child) {
      return child.values();
    });
  }
}


Parchment.define(Parchment);
Parchment.define(TextBlot);
Parchment.define(BlockBlot);
Parchment.define(InlineBlot);
Parchment.define(BreakBlot);


export default Parchment;
