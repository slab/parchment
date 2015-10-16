import Blot from './blot/abstract/blot';
import BlockBlot from './blot/block';
import EmbedBlot from './blot/embed';
import LeafBlot from './blot/abstract/leaf';
import InlineBlot from './blot/inline';
import ContainerBlot from './blot/container';
import ParchmentBlot from './blot/parchment';
import TextBlot from './blot/text';

import StyleAttributor from './attributor/style';

import * as Registry from './registry';

class Parchment extends ParchmentBlot {
  static PREFIX = Registry.PREFIX;

  static Container = ContainerBlot;
  static Block = BlockBlot;
  static Inline = InlineBlot;
  static Leaf = LeafBlot;
  static Embed = EmbedBlot;

  static Style = StyleAttributor;

  static create = Registry.create;
  static match = Registry.match;
  static register = Registry.register;

  static Type = Registry.Type;

  static findBlot = Blot.findBlot;
}


Parchment.register(ContainerBlot);
Parchment.register(BlockBlot);
Parchment.register(InlineBlot);
Parchment.register(TextBlot);
Parchment.register(Parchment);


export default Parchment;
