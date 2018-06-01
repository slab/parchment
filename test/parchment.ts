import Attributor from '../src/attributor/attributor';
import ClassAttributor from '../src/attributor/class';
import StyleAttributor from '../src/attributor/style';

import ShadowBlot from '../src/blot/abstract/shadow';
import ParentBlot from '../src/blot/abstract/parent';
import ContainerBlot from '../src/blot/abstract/container';
import LeafBlot from '../src/blot/abstract/leaf';

import ScrollBlot from '../src/blot/scroll';
import BlockBlot from '../src/blot/block';
import InlineBlot from '../src/blot/inline';
import EmbedBlot from '../src/blot/embed';
import TextBlot from '../src/blot/text';

import LinkedList from '../src/collection/linked-list';
import Registry from '../src/registry';
import Scope from '../src/scope';

const TestRegistry = new Registry();

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
window['LeafBlot'] = LeafBlot;
// @ts-ignore
window['EmbedBlot'] = EmbedBlot;

// @ts-ignore
window['ScrollBlot'] = ScrollBlot;
// @ts-ignore
window['ContainerBlot'] = ContainerBlot;
// @ts-ignore
window['BlockBlot'] = BlockBlot;
// @ts-ignore
window['InlineBlot'] = InlineBlot;
// @ts-ignore
window['TextBlot'] = TextBlot;

// @ts-ignore
window['LinkedList'] = LinkedList;
// @ts-ignore
window['Scope'] = Scope;
// @ts-ignore
window['Registry'] = Registry;
// @ts-ignore
window['TestRegistry'] = TestRegistry;

TestRegistry.register(ScrollBlot);
TestRegistry.register(BlockBlot);
TestRegistry.register(InlineBlot);
TestRegistry.register(TextBlot);
