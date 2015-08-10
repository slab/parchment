import Blot from './blot/blot';
import BlockBlot from './blot/parent/block';
import EmbedBlot from './blot/leaf/embed';
import InlineBlot from './blot/parent/inline';
import ParentBlot from './blot/parent/parent';
import RootBlot from './blot/parent/root';
import TextBlot from './blot/leaf/text';

import StyleAttributor from './attributor/style';

import * as Registry from './registry';


var Parchment = {
  Root: RootBlot,
  Block: BlockBlot,
  Parent: ParentBlot,
  Inline: InlineBlot,
  Embed: EmbedBlot,
  Text: TextBlot,

  Style: StyleAttributor,

  create: Registry.create,
  define: Registry.define,
  match: Registry.match,

  findBlot: Blot.findBlot
};


Parchment.define(TextBlot);
Parchment.define(BlockBlot);
Parchment.define(InlineBlot);


// ES6 export will not correctly expose an object { default: Parchment }
export = Parchment;
