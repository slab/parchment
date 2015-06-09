import BlockBlot from './blot/parent/block';
import ContainerBlot from './blot/parent/container';
import EmbedBlot from './blot/leaf/embed';
import InlineBlot from './blot/parent/inline';
import ParentBlot from './blot/parent/parent';
import TextBlot from './blot/leaf/text';

import StyleAttribute from './attribute/style';

import * as Registry from './registry';


class Parchment extends ContainerBlot {
  static blotName = 'parchment';

  static Block = BlockBlot;
  static Parent = ParentBlot;
  static Inline = InlineBlot;
  static Embed = EmbedBlot;
  static Text = TextBlot;

  static Style = StyleAttribute;

  static create = Registry.create;
  static define = Registry.define;
  static match = Registry.match;
}


Parchment.define(Parchment);
Parchment.define(TextBlot);
Parchment.define(BlockBlot);
Parchment.define(InlineBlot);


// ES6 export will not correctly expose an object { default: Parchment }
export = Parchment;
