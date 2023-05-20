import { setupContextBeforeEach } from '../setup';

describe('Block', function () {
  const ctx = setupContextBeforeEach();

  describe('format', function () {
    it('add', function () {
      let block = ctx.scroll.create('block');
      ctx.scroll.appendChild(block);
      block.format('header', 'h1');
      expect(ctx.scroll.domNode.innerHTML).toBe('<h1></h1>');
      expect(ctx.scroll.children.head.statics.blotName).toBe('header');
      expect(ctx.scroll.children.head.formats()).toEqual({ header: 'h1' });
    });

    it('remove', function () {
      let block = ctx.scroll.create('header', 'h1');
      ctx.scroll.appendChild(block);
      block.format('header', false);
      expect(ctx.scroll.domNode.innerHTML).toBe('<p></p>');
      expect(ctx.scroll.children.head.statics.blotName).toBe('block');
      expect(ctx.scroll.children.head.formats()).toEqual({});
    });

    it('change', function () {
      let block = ctx.scroll.create('block');
      let text = ctx.scroll.create('text', 'Test');
      block.appendChild(text);
      ctx.scroll.appendChild(block);
      block.format('header', 'h2');
      expect(ctx.scroll.domNode.innerHTML).toBe('<h2>Test</h2>');
      expect(ctx.scroll.children.head.statics.blotName).toBe('header');
      expect(ctx.scroll.children.head.formats()).toEqual({ header: 'h2' });
      expect(ctx.scroll.children.head.children.length).toBe(1);
      expect(ctx.scroll.children.head.children.head).toBe(text);
    });

    it('split', function () {
      let block = ctx.scroll.create('block');
      let text = ctx.scroll.create('text', 'Test');
      block.appendChild(text);
      ctx.scroll.appendChild(block);
      let src = 'http://www.w3schools.com/html/mov_bbb.mp4';
      block.insertAt(2, 'video', src);
      expect(ctx.scroll.domNode.innerHTML).toBe(
        `<p>Te</p><video src="${src}"></video><p>st</p>`,
      );
      expect(ctx.scroll.children.length).toBe(3);
      expect(ctx.scroll.children.head.next.statics.blotName).toBe('video');
    });

    it('ignore inline', function () {
      let block = ctx.scroll.create('header', 1);
      ctx.scroll.appendChild(block);
      block.format('bold', true);
      expect(ctx.scroll.domNode.innerHTML).toBe('<h1></h1>');
      expect(ctx.scroll.children.head.statics.blotName).toBe('header');
      expect(ctx.scroll.children.head.formats()).toEqual({ header: 'h1' });
    });
  });
});
