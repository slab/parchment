// import Attribute = require('../src/attribute/attribute');
// import Class = require('../src/attribute/class');
// import Style = require('../src/attribute/style');

import OrderedMap = require('../src/lib/ordered-map');
import TreeList = require('../src/lib/tree-list');

import Block = require('../src/node/block');
import Break = require('../src/node/break');
import Embed = require('../src/node/embed');
import Inline = require('../src/node/inline');
import Text = require('../src/node/text');

import ParchmentNode = require('../src/parchment-node');
import Parchment = require('../src/parchment');
import Registry = require('../src/registry');
import ShadowNode = require('../src/shadow-node');


// window['Attribute'] = Attribute;
// window['Class'] = Class;
// window['Style'] = Style;

window['OrderedMap'] = OrderedMap;
window['TreeList'] = TreeList;

window['Block'] = Block;
window['Break'] = Break;
window['Embed'] = Embed;
window['Inline'] = Inline;
window['Text'] = Text;

window['ParchmentNode'] = ParchmentNode;
window['Parchment'] = Parchment;
window['Registry'] = Registry;
window['ShadowNode'] = ShadowNode;
