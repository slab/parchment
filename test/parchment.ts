// import Attribute = require('../src/attribute/attribute');
// import Class = require('../src/attribute/class');
// import Style = require('../src/attribute/style');

import LinkedList = require('../src/lib/linked-list');
import OrderedMap = require('../src/lib/ordered-map');
import Util = require('../src/lib/util');

import LeafNode = require('../src/node/base/leaf');
import ParentNode = require('../src/node/base/parent');
import Shadow = require('../src/node/base/shadow');

import BlockNode = require('../src/node/block');
import BreakNode = require('../src/node/break');
import EmbedNode = require('../src/node/embed');
import InlineNode = require('../src/node/inline');
import TextNode = require('../src/node/text');

import Parchment = require('../src/parchment');
import Registry = require('../src/registry');


// window['Attribute'] = Attribute;
// window['Class'] = Class;
// window['Style'] = Style;

window['LinkedList'] = LinkedList;
window['OrderedMap'] = OrderedMap;
window['Util'] = Util;

window['LeafNode'] = LeafNode;
window['ParentNode'] = ParentNode;
window['ShadowNode'] = Shadow.ShadowNode;
window['ShadowParent'] = Shadow.ShadowParent;

window['BlockNode'] = BlockNode;
window['BreakNode'] = BreakNode;
window['EmbedNode'] = EmbedNode;
window['InlineNode'] = InlineNode;
window['TextNode'] = TextNode;

window['Parchment'] = Parchment;
window['Registry'] = Registry;
