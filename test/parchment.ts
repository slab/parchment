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

// @ts-expect-error
window['Attributor'] = Attributor;
// @ts-expect-error
window['ClassAttributor'] = ClassAttributor;
// @ts-expect-error
window['StyleAttributor'] = StyleAttributor;

// @ts-expect-error
window['ShadowBlot'] = ShadowBlot;
// @ts-expect-error
window['ParentBlot'] = ParentBlot;
// @ts-expect-error
window['LeafBlot'] = LeafBlot;
// @ts-expect-error
window['EmbedBlot'] = EmbedBlot;

// @ts-expect-error
window['ScrollBlot'] = ScrollBlot;
// @ts-expect-error
window['ContainerBlot'] = ContainerBlot;
// @ts-expect-error
window['BlockBlot'] = BlockBlot;
// @ts-expect-error
window['InlineBlot'] = InlineBlot;
// @ts-expect-error
window['TextBlot'] = TextBlot;

// @ts-expect-error
window['LinkedList'] = LinkedList;
// @ts-expect-error
window['Scope'] = Scope;
// @ts-expect-error
window['Registry'] = Registry;
// @ts-expect-error
window['TestRegistry'] = TestRegistry;

TestRegistry.register(ScrollBlot);
TestRegistry.register(BlockBlot);
TestRegistry.register(InlineBlot);
TestRegistry.register(TextBlot);
