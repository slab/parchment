import Attributor from '../src/attributor/attributor';
import ClassAttributor from '../src/attributor/class';
import StyleAttributor from '../src/attributor/style';

import ShadowBlot from '../src/blot/abstract/shadow';
import ContainerBlot from '../src/blot/abstract/container';
import FormatBlot from '../src/blot/abstract/format';
import LeafBlot from '../src/blot/abstract/leaf';

import ScrollBlot from '../src/blot/scroll';
import BlockBlot from '../src/blot/block';
import InlineBlot from '../src/blot/inline';
import EmbedBlot from '../src/blot/embed';
import TextBlot from '../src/blot/text';

import LinkedList from '../src/collection/linked-list';

import * as Registry from '../src/registry';
import Parchment from '../src/parchment';

window['Attributor'] = Attributor;
window['ClassAttributor'] = ClassAttributor;
window['StyleAttributor'] = StyleAttributor;

window['ShadowBlot'] = ShadowBlot;
window['ContainerBlot'] = ContainerBlot;
window['FormatBlot'] = FormatBlot;
window['LeafBlot'] = LeafBlot;
window['EmbedBlot'] = EmbedBlot;

window['ScrollBlot'] = ScrollBlot;
window['BlockBlot'] = BlockBlot;
window['InlineBlot'] = InlineBlot;
window['TextBlot'] = TextBlot;

window['LinkedList'] = LinkedList;

window['Parchment'] = Parchment;
window['Registry'] = Registry;

Registry.register(ScrollBlot);
Registry.register(BlockBlot);
Registry.register(InlineBlot);
Registry.register(TextBlot);
