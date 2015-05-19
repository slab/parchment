import BlockBlot from './blot/parent/block';
import EmbedBlot from './blot/leaf/embed';
import LeafBlot from './blot/leaf/base';
import InlineBlot from './blot/parent/inline';
import ParentBlot from './blot/parent/base';

import Blot from './blot/base';

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

  static compare = Registry.compare;
  static create = Registry.create;
  static define = Registry.define;
  static match = Registry.match;

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

// ES6 export will not correctly expose an object { define: Parchment }
export = Parchment;
