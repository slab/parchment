import Blot from './blot/abstract/blot';
import BlockBlot from './blot/block';
import EmbedBlot from './blot/embed';
import InlineBlot from './blot/inline';
import ContainerBlot from './blot/container';
import TextBlot from './blot/text';

import StyleAttributor from './attributor/style';

import * as Registry from './registry';


var Parchment = {
  PREFIX: Registry.PREFIX,

  Container: ContainerBlot,
  Block: BlockBlot,
  Inline: InlineBlot,
  Embed: EmbedBlot,

  Style: StyleAttributor,

  create: Registry.create,
  define: Registry.define,
  match: Registry.match,

  types: Registry.Type,    // TODO: Do we want this named differently?

  findBlot: Blot.findBlot
};


Parchment.define(ContainerBlot);
Parchment.define(BlockBlot);
Parchment.define(InlineBlot);
Parchment.define(TextBlot);


// ES6 export will not correctly expose an object { default: Parchment }
export = Parchment;
