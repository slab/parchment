import Attributor from '../src/attributor/attributor';
import ClassAttributor from '../src/attributor/class';
import StyleAttributor from '../src/attributor/style';

// import Blot from '../src/blot/abstract/blot';
// import LeafBlot from '../src/blot/abstract/leaf';
// import ContainerBlot from '../src/blot/abstract/container';

// import BlockBlot from '../src/blot/block';
// import InlineBlot from '../src/blot/inline';
// import EmbedBlot from '../src/blot/embed';
// import TextBlot from '../src/blot/text';

import LinkedList from '../src/collection/linked-list';

import * as Registry from '../src/registry';
import Parchment from '../src/parchment';


window['Attributor'] = Attributor;
window['ClassAttributor'] = ClassAttributor;
window['StyleAttributor'] = StyleAttributor;

// window['Blot'] = Blot;
// window['LeafBlot'] = LeafBlot;

// window['ContainerBlot'] = ContainerBlot;
// window['BlockBlot'] = BlockBlot;
// window['InlineBlot'] = InlineBlot;
// window['EmbedBlot'] = EmbedBlot;
// window['TextBlot'] = TextBlot;

window['LinkedList'] = LinkedList;

window['Parchment'] = Parchment;
window['Registry'] = Registry;
