import Attributor from '../src/attributor/attributor';
import ClassAttributor from '../src/attributor/class';
import StyleAttributor from '../src/attributor/style';

import ShadowBlot from '../src/blot/abstract/shadow';
import ParentBlot from '../src/blot/abstract/parent';
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

// @ts-ignore
window['Attributor'] = Attributor;
// @ts-ignore
window['ClassAttributor'] = ClassAttributor;
// @ts-ignore
window['StyleAttributor'] = StyleAttributor;

// @ts-ignore
window['ShadowBlot'] = ShadowBlot;
// @ts-ignore
window['ParentBlot'] = ParentBlot;
// @ts-ignore
window['FormatBlot'] = FormatBlot;
// @ts-ignore
window['LeafBlot'] = LeafBlot;
// @ts-ignore
window['EmbedBlot'] = EmbedBlot;

// @ts-ignore
window['ScrollBlot'] = ScrollBlot;
// @ts-ignore
window['BlockBlot'] = BlockBlot;
// @ts-ignore
window['InlineBlot'] = InlineBlot;
// @ts-ignore
window['TextBlot'] = TextBlot;

// @ts-ignore
window['LinkedList'] = LinkedList;

// @ts-ignore
window['Parchment'] = Parchment;
// @ts-ignore
window['Registry'] = Registry;

Registry.register(ScrollBlot);
Registry.register(BlockBlot);
Registry.register(InlineBlot);
Registry.register(TextBlot);
