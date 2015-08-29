import StyleAttributor from '../src/attributor/style';

import Blot from '../src/blot/abstract/blot';
import ParentBlot from '../src/blot/abstract/parent';

import ContainerBlot from '../src/blot/container';
import BlockBlot from '../src/blot/block';
import InlineBlot from '../src/blot/inline';
import EmbedBlot from '../src/blot/embed';
import TextBlot from '../src/blot/text';

import LinkedList from '../src/collection/linked-list';

import * as Registry from '../src/registry';
import Parchment = require('../src/parchment');


window['StyleAttributor'] = StyleAttributor;

window['Blot'] = Blot;
window['ParentBlot'] = ParentBlot;

window['ContainerBlot'] = ContainerBlot;
window['BlockBlot'] = BlockBlot;
window['InlineBlot'] = InlineBlot;
window['EmbedBlot'] = EmbedBlot;
window['TextBlot'] = TextBlot;

window['LinkedList'] = LinkedList;

window['Parchment'] = Parchment;
window['Registry'] = Registry;
