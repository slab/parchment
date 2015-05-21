import BlockBlot from './blot/parent/block';
import ContainerBlot from './blot/parent/container';
import EmbedBlot from './blot/leaf/embed';
import InlineBlot from './blot/parent/inline';
import ParentBlot from './blot/parent/parent';

import Blot from './blot/blot';

import TextBlot from './blot/leaf/text';
import BreakBlot from './blot/leaf/break';

import * as Registry from './registry';


class Parchment extends ContainerBlot {
  static nodeName = 'parchment';

  static Block = BlockBlot;
  static Embed = EmbedBlot;
  static Inline = InlineBlot;
  static Parent = ParentBlot;

  static Scope = Registry.Scope;
  static compare = Registry.compare;
  static create = Registry.create;
  static define = Registry.define;
  static match = Registry.match;
}


Parchment.define(Parchment);
Parchment.define(TextBlot);
Parchment.define(BlockBlot);
Parchment.define(InlineBlot);
Parchment.define(BreakBlot);


// ES6 export will not correctly expose an object { define: Parchment }
export = Parchment;
