'use strict';

describe('Block', function () {
  describe('format', function () {
    it('add', function () {
      let block = this.scroll.create('block');
      this.scroll.appendChild(block);
      block.format('header', 'h1');
      expect(this.scroll.domNode.innerHTML).toBe('<h1></h1>');
      expect(this.scroll.children.head.statics.blotName).toBe('header');
      expect(this.scroll.children.head.formats()).toEqual({ header: 'h1' });
    });

    it('remove', function () {
      let block = this.scroll.create('header', 'h1');
      this.scroll.appendChild(block);
      block.format('header', false);
      expect(this.scroll.domNode.innerHTML).toBe('<p></p>');
      expect(this.scroll.children.head.statics.blotName).toBe('block');
      expect(this.scroll.children.head.formats()).toEqual({});
    });

    it('change', function () {
      let block = this.scroll.create('block');
      let text = this.scroll.create('text', 'Test');
      block.appendChild(text);
      this.scroll.appendChild(block);
      block.format('header', 'h2');
      expect(this.scroll.domNode.innerHTML).toBe('<h2>Test</h2>');
      expect(this.scroll.children.head.statics.blotName).toBe('header');
      expect(this.scroll.children.head.formats()).toEqual({ header: 'h2' });
      expect(this.scroll.children.head.children.length).toBe(1);
      expect(this.scroll.children.head.children.head).toBe(text);
    });

    it('split', function () {
      let block = this.scroll.create('block');
      let text = this.scroll.create('text', 'Test');
      block.appendChild(text);
      this.scroll.appendChild(block);
      let src = 'http://www.w3schools.com/html/mov_bbb.mp4';
      block.insertAt(2, 'video', src);
      expect(this.scroll.domNode.innerHTML).toBe(
        `<p>Te</p><video src="${src}"></video><p>st</p>`,
      );
      expect(this.scroll.children.length).toBe(3);
      expect(this.scroll.children.head.next.statics.blotName).toBe('video');
    });

    it('ignore inline', function () {
      let block = this.scroll.create('header', 1);
      this.scroll.appendChild(block);
      block.format('bold', true);
      expect(this.scroll.domNode.innerHTML).toBe('<h1></h1>');
      expect(this.scroll.children.head.statics.blotName).toBe('header');
      expect(this.scroll.children.head.formats()).toEqual({ header: 'h1' });
    });
  });
});
