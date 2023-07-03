import TextBlot from '../../src/blot/text';
import type { BlockBlot, InlineBlot } from '../../src/parchment';
import { setupContextBeforeEach } from '../setup';

describe('TextBlot', function () {
  const ctx = setupContextBeforeEach();

  it('constructor(node)', function () {
    let node = document.createTextNode('Test');
    let blot = new TextBlot(ctx.scroll, node);
    expect(blot['text']).toEqual('Test');
    expect(blot.domNode.data).toEqual('Test');
  });

  it('deleteAt() partial', function () {
    let blot = ctx.scroll.create('text', 'Test') as TextBlot;
    blot.deleteAt(1, 2);
    expect(blot.value()).toEqual('Tt');
    expect(blot.length()).toEqual(2);
  });

  it('deleteAt() all', function () {
    let container = ctx.scroll.create('inline') as InlineBlot;
    let textBlot = ctx.scroll.create('text', 'Test') as TextBlot;
    container.appendChild(textBlot);
    expect(container.domNode.firstChild).toEqual(textBlot.domNode);
    textBlot.deleteAt(0, 4);
    expect(textBlot.domNode.data).toEqual('');
  });

  it('insertAt() text', function () {
    let textBlot = ctx.scroll.create('text', 'Test') as TextBlot;
    textBlot.insertAt(1, 'ough');
    expect(textBlot.value()).toEqual('Toughest');
  });

  it('insertAt() other', function () {
    let container = ctx.scroll.create('inline') as InlineBlot;
    let textBlot = ctx.scroll.create('text', 'Test') as TextBlot;
    container.appendChild(textBlot);
    textBlot.insertAt(2, 'image', {});
    expect(textBlot.value()).toEqual('Te');
    expect(textBlot.next?.statics.blotName).toEqual('image');
    const nextNext = textBlot.next?.next;
    expect(nextNext instanceof TextBlot && nextNext.value()).toEqual('st');
  });

  it('split() middle', function () {
    let container = ctx.scroll.create('inline') as InlineBlot;
    let textBlot = ctx.scroll.create('text', 'Test') as TextBlot;
    container.appendChild(textBlot);
    let after = textBlot.split(2);
    expect(textBlot.value()).toEqual('Te');
    expect(after instanceof TextBlot && after.value()).toEqual('st');
    expect(textBlot.next).toEqual(after);
    expect(after instanceof TextBlot && after.prev).toEqual(textBlot);
  });

  it('split() noop', function () {
    let container = ctx.scroll.create('inline') as InlineBlot;
    let textBlot = ctx.scroll.create('text', 'Test') as TextBlot;
    container.appendChild(textBlot);
    let before = textBlot.split(0);
    let after = textBlot.split(4);
    expect(before).toEqual(textBlot);
    expect(after).toBe(null);
  });

  it('split() force', function () {
    let container = ctx.scroll.create('inline') as InlineBlot;
    let textBlot = ctx.scroll.create('text', 'Test') as TextBlot;
    container.appendChild(textBlot);
    let after = textBlot.split(4, true);
    expect(after).not.toEqual(textBlot);
    expect(after instanceof TextBlot && after.value()).toEqual('');
    expect(textBlot.next).toEqual(after);
    expect(after?.prev).toEqual(textBlot);
  });

  it('format wrap', function () {
    let container = ctx.scroll.create('inline') as InlineBlot;
    let textBlot = ctx.scroll.create('text', 'Test') as TextBlot;
    container.appendChild(textBlot);
    textBlot.formatAt(0, 4, 'bold', true);
    expect(textBlot.domNode.parentElement?.tagName).toEqual('STRONG');
    expect(textBlot.value()).toEqual('Test');
  });

  it('format null', function () {
    let container = ctx.scroll.create('inline') as InlineBlot;
    let textBlot = ctx.scroll.create('text', 'Test') as TextBlot;
    container.appendChild(textBlot);
    textBlot.formatAt(0, 4, 'bold', null);
    expect(textBlot.domNode.parentElement?.tagName).toEqual('SPAN');
    expect(textBlot.value()).toEqual('Test');
  });

  it('format split', function () {
    let container = ctx.scroll.create('block') as BlockBlot;
    let textBlot = ctx.scroll.create('text', 'Test') as TextBlot;
    container.appendChild(textBlot);
    textBlot.formatAt(1, 2, 'bold', true);
    expect(container.domNode.innerHTML).toEqual('T<strong>es</strong>t');
    expect(textBlot.next?.statics.blotName).toEqual('bold');
    expect(textBlot.value()).toEqual('T');
  });

  it('index()', function () {
    let textBlot = ctx.scroll.create('text', 'Test') as TextBlot;
    expect(textBlot.index(textBlot.domNode, 2)).toEqual(2);
    expect(textBlot.index(document.body, 2)).toEqual(-1);
  });

  it('position()', function () {
    let textBlot = ctx.scroll.create('text', 'Test') as TextBlot;
    let [node, offset] = textBlot.position(2);
    expect(node).toEqual(textBlot.domNode);
    expect(offset).toEqual(2);
  });
});
