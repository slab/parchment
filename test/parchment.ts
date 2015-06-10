import StyleAttribute from '../src/attribute/style';

import EmbedBlot from '../src/blot/leaf/embed';
import TextBlot from '../src/blot/leaf/text';
import ParentBlot from '../src/blot/parent/parent';
import ContainerBlot from '../src/blot/parent/container';
import BlockBlot from '../src/blot/parent/block';
import InlineBlot from '../src/blot/parent/inline';

import LinkedList from '../src/collection/linked-list';
import OrderedMap from '../src/collection/ordered-map';

import { ShadowNode } from '../src/blot/shadow';

import * as Registry from '../src/registry';
import * as Util from '../src/util';

import Parchment = require('../src/parchment');


window['StyleAttribute'] = StyleAttribute;

window['EmbedBlot'] = EmbedBlot;
window['TextBlot'] = TextBlot;
window['ParentBlot'] = ParentBlot;
window['BlockBlot'] = BlockBlot;
window['InlineBlot'] = InlineBlot;

window['LinkedList'] = LinkedList;
window['OrderedMap'] = OrderedMap;

window['ShadowNode'] = ShadowNode;

window['Parchment'] = Parchment;
window['Registry'] = Registry;
window['Util'] = Util;
