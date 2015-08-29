import StyleAttributor from '../src/attributor/style';

import Blot from '../src/blot/blot';
import EmbedBlot from '../src/blot/embed';
import TextBlot from '../src/blot/text';
import ParentBlot from '../src/blot/parent';
import ContainerBlot from '../src/blot/container';
import BlockBlot from '../src/blot/block';
import InlineBlot from '../src/blot/inline';

import LinkedList from '../src/collection/linked-list';

import ShadowNode from '../src/blot/shadow';

import * as Registry from '../src/registry';
import * as Util from '../src/util';

import Parchment = require('../src/parchment');


window['StyleAttributor'] = StyleAttributor;

window['Blot'] = Blot;
window['EmbedBlot'] = EmbedBlot;
window['TextBlot'] = TextBlot;
window['ParentBlot'] = ParentBlot;
window['BlockBlot'] = BlockBlot;
window['InlineBlot'] = InlineBlot;
window['ContainerBlot'] = ContainerBlot;

window['LinkedList'] = LinkedList;

window['ShadowNode'] = ShadowNode;

window['Parchment'] = Parchment;
window['Registry'] = Registry;
window['Util'] = Util;
