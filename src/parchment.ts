import Blot from './blot/blot';
import BlockBlot from './blot/block';
import EmbedBlot from './blot/embed';
import InlineBlot from './blot/inline';
import ParentBlot from './blot/parent';
import ContainerBlot from './blot/container';
import TextBlot from './blot/text';

import StyleAttributor from './attributor/style';

import * as Registry from './registry';


var Parchment = {
  PREFIX: Registry.PREFIX,

  Container: ContainerBlot,
  Block: BlockBlot,
  Parent: ParentBlot,
  Inline: InlineBlot,
  Embed: EmbedBlot,
  Text: TextBlot,

  Style: StyleAttributor,

  create: Registry.create,
  define: Registry.define,
  match: Registry.match,

  types: Registry.Type,    // TODO: Do we want this named differently?

  findBlot: Blot.findBlot
};


Parchment.define(TextBlot);
Parchment.define(BlockBlot);
Parchment.define(InlineBlot);


// ES6 export will not correctly expose an object { default: Parchment }
export = Parchment;
