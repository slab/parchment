import StyleAttributor from '../src/attributor/style';

import Blot from '../src/blot/blot';
import EmbedBlot from '../src/blot/leaf/embed';
import TextBlot from '../src/blot/leaf/text';
import ParentBlot from '../src/blot/parent/parent';
import ContainerBlot from '../src/blot/parent/container';
import BlockBlot from '../src/blot/parent/block';
import InlineBlot from '../src/blot/parent/inline';

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
