import { describe, it, expect } from 'vitest';
import type { BlockBlot } from '../../src/parchment';
import type { HeaderBlot } from '../__helpers__/registry/block';
import { setupContextBeforeEach } from '../setup';

describe('Block', function () {
  const ctx = setupContextBeforeEach();

  describe('format', function () {
    it('add', function () {
      const block = ctx.scroll.create('block') as BlockBlot;
      ctx.scroll.appendChild(block);
      block.format('header', 'h1');
      expect(ctx.scroll.domNode.innerHTML).toBe('<h1></h1>');
      const childrenHead = ctx.scroll.children.head as HeaderBlot;
      expect(childrenHead.statics.blotName).toBe('header');
      expect(childrenHead.formats()).toEqual({ header: 'h1' });
    });

    it('remove', function () {
      const block = ctx.scroll.create('header', 'h1') as HeaderBlot;
      ctx.scroll.appendChild(block);
      block.format('header', false);
      expect(ctx.scroll.domNode.innerHTML).toBe('<p></p>');
      const childrenHead = ctx.scroll.children.head as BlockBlot;
      expect(childrenHead.statics.blotName).toBe('block');
      expect(childrenHead.formats()).toEqual({});
    });

    it('change', function () {
      const block = ctx.scroll.create('block') as BlockBlot;
      const text = ctx.scroll.create('text', 'Test');
      block.appendChild(text);
      ctx.scroll.appendChild(block);
      block.format('header', 'h2');
      expect(ctx.scroll.domNode.innerHTML).toBe('<h2>Test</h2>');
      const childrenHead = ctx.scroll.children.head as HeaderBlot;
      expect(childrenHead.statics.blotName).toBe('header');
      expect(childrenHead.formats()).toEqual({ header: 'h2' });
      expect(childrenHead.children.length).toBe(1);
      expect(childrenHead.children.head).toBe(text);
    });

    it('split', function () {
      const block = ctx.scroll.create('block') as BlockBlot;
      const text = ctx.scroll.create('text', 'Test');
      block.appendChild(text);
      ctx.scroll.appendChild(block);
      const src = 'http://www.w3schools.com/html/mov_bbb.mp4';
      block.insertAt(2, 'video', src);
      expect(ctx.scroll.domNode.innerHTML).toBe(
        `<p>Te</p><video src="${src}"></video><p>st</p>`,
      );
      expect(ctx.scroll.children.length).toBe(3);
      expect(ctx.scroll.children.head?.next?.statics.blotName).toBe('video');
    });

    it('ignore inline', function () {
      const block = ctx.scroll.create('header', 1) as HeaderBlot;
      ctx.scroll.appendChild(block);
      block.format('bold', true);
      expect(ctx.scroll.domNode.innerHTML).toBe('<h1></h1>');
      const childrenHead = ctx.scroll.children.head as HeaderBlot;
      expect(childrenHead.statics.blotName).toBe('header');
      expect(childrenHead.formats()).toEqual({ header: 'h1' });
    });
  });
});
