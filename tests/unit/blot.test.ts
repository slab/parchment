import { describe, it, expect } from 'vitest';
import type { BlockBlot, Parent } from '../../src/parchment';
import Registry from '../../src/registry';
import type { ItalicBlot } from '../__helpers__/registry/inline';
import { setupContextBeforeEach } from '../setup';

describe('Blot', function () {
  const ctx = setupContextBeforeEach();

  it('offset()', function () {
    const blockNode = document.createElement('p');
    blockNode.innerHTML = '<span>01</span><em>23<strong>45</strong></em>';
    const blockBlot = ctx.scroll.create(blockNode) as BlockBlot;
    const boldBlot = (blockBlot.children.tail as Parent)?.children.tail;
    expect(boldBlot?.offset()).toEqual(2);
    expect(boldBlot?.offset(blockBlot)).toEqual(4);
  });

  it('detach()', function () {
    const blot = ctx.scroll.create('block');
    expect(Registry.blots.get(blot.domNode)).toEqual(blot);
    blot.detach();
    expect(Registry.blots.get(blot.domNode)).toEqual(undefined);
  });

  it('remove()', function () {
    const blot = ctx.scroll.create('block') as BlockBlot;
    const text = ctx.scroll.create('text', 'Test');
    blot.appendChild(text);
    expect(blot.children.head).toBe(text);
    expect(blot.domNode.innerHTML).toBe('Test');
    text.remove();
    expect(blot.children.length).toBe(0);
    expect(blot.domNode.innerHTML).toBe('');
  });

  it('wrap()', function () {
    const parent = ctx.scroll.create('block') as BlockBlot;
    const head = ctx.scroll.create('bold');
    const text = ctx.scroll.create('text', 'Test');
    const tail = ctx.scroll.create('bold');
    parent.appendChild(head);
    parent.appendChild(text);
    parent.appendChild(tail);
    expect(parent.domNode.innerHTML).toEqual(
      '<strong></strong>Test<strong></strong>',
    );
    const wrapper = text.wrap('italic', true);
    expect(parent.domNode.innerHTML).toEqual(
      '<strong></strong><em>Test</em><strong></strong>',
    );
    expect(parent.children.head).toEqual(head);
    expect(parent.children.head?.next).toEqual(wrapper);
    expect(parent.children.tail).toEqual(tail);
  });

  it('wrap() with blot', function () {
    const parent = ctx.scroll.create('block') as BlockBlot;
    const text = ctx.scroll.create('text', 'Test');
    const italic = ctx.scroll.create('italic') as ItalicBlot;
    parent.appendChild(text);
    text.wrap(italic);
    expect(parent.domNode.innerHTML).toEqual('<em>Test</em>');
  });
});
