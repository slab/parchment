import Blot from './blot/abstract/blot';
// import EmbedBlot from './blot/embed';
import LeafBlot from './blot/abstract/leaf';
import FormatBlot from './blot/abstract/format';
// import ScrollBlot from './blot/scroll';
import ContainerBlot from './blot/abstract/container';
// import TextBlot from './blot/text';

import ClassAttributor from './attributor/class';
import StyleAttributor from './attributor/style';

import * as Registry from './registry';


let Parchment = {
  PREFIX: Registry.PREFIX,
  Scope: Registry.Scope,

  create: Registry.create,
  match: Registry.match,
  register: Registry.register,

  Container: ContainerBlot,
  Format: FormatBlot,
  // Scroll: ScrollBlot,
  Leaf: LeafBlot,
  // Embed: EmbedBlot,

  Attributor: {
    Class: ClassAttributor,
    Style: StyleAttributor
  },

  findBlot: Blot.findBlot
};


// Parchment.register(ContainerBlot);
// Parchment.register(TextBlot);


export default Parchment;
