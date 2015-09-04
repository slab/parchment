import Blot from './blot/abstract/blot';
import BlockBlot from './blot/block';
import EmbedBlot from './blot/embed';
import LeafBlot from './blot/abstract/leaf';
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
  Leaf: LeafBlot,
  Embed: EmbedBlot,

  Style: StyleAttributor,

  create: Registry.create,
  match: Registry.match,
  register: Registry.register,

  Type: Registry.Type,

  findBlot: Blot.findBlot
};


Parchment.register(ContainerBlot);
Parchment.register(BlockBlot);
Parchment.register(InlineBlot);
Parchment.register(TextBlot);


// ES6 export will not correctly expose an object { default: Parchment }
export = Parchment;
