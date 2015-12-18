import Blot from './blot/abstract/blot';
import BlockBlot from './blot/block';
import EmbedBlot from './blot/embed';
import LeafBlot from './blot/abstract/leaf';
import InlineBlot from './blot/inline';
import ContainerBlot from './blot/container';
import TextBlot from './blot/text';

import ClassAttributor from './attributor/class';
import StyleAttributor from './attributor/style';

import * as Registry from './registry';


var Parchment = {
  PREFIX: Registry.PREFIX,
  Scope: Registry.Scope,

  create: Registry.create,
  match: Registry.match,
  register: Registry.register,

  Container: ContainerBlot,
  Block: BlockBlot,
  Inline: InlineBlot,
  Leaf: LeafBlot,
  Embed: EmbedBlot,

  Attributor: {
    Class: ClassAttributor,
    Style: StyleAttributor
  },

  findBlot: Blot.findBlot
};


Parchment.register(ContainerBlot);
Parchment.register(BlockBlot);
Parchment.register(InlineBlot);
Parchment.register(TextBlot);


export default Parchment;
