// import Attribute from '../src/attribute/base';
// import StyleAttribute from '../src/attribute/style';

import LeafBlot from '../src/blot/leaf/base';
import BreakBlot from '../src/blot/leaf/break';
import EmbedBlot from '../src/blot/leaf/embed';
import TextBlot from '../src/blot/leaf/text';
import ParentBlot from '../src/blot/parent/base';
import BlockBlot from '../src/blot/parent/block';
import InlineBlot from '../src/blot/parent/inline';

import LinkedList from '../src/collection/linked-list';
import OrderedMap from '../src/collection/ordered-map';

import Shadow from '../src/shadow/base';
import ShadowParent from '../src/shadow/parent';

import * as Registry from '../src/registry';
import * as Util from '../src/util';

import Parchment = require('../src/parchment');


// window['Attribute'] = Attribute;
// window['Class'] = Class;
// window['Style'] = Style;

window['LeafBlot'] = LeafBlot;
window['BreakBlot'] = BreakBlot;
window['EmbedBlot'] = EmbedBlot;
window['TextBlot'] = TextBlot;
window['ParentBlot'] = ParentBlot;
window['BlockBlot'] = BlockBlot;
window['InlineBlot'] = InlineBlot;

window['LinkedList'] = LinkedList;
window['OrderedMap'] = OrderedMap;

window['Shadow'] = Shadow;
window['ShadowParent'] = ShadowParent;

window['Parchment'] = Parchment;
window['Registry'] = Registry;
window['Util'] = Util;
