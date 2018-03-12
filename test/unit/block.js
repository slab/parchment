'use strict';

describe('Block', function() {
  describe('format', function() {
    it('add', function() {
      let container = Registry.create('scroll');
      let block = Registry.create('block');
      container.appendChild(block);
      block.format('header', 'h1');
      expect(container.domNode.innerHTML).toBe('<h1></h1>');
      expect(container.children.head.statics.blotName).toBe('header');
      expect(container.children.head.formats()).toEqual({ header: 'h1' });
    });

    it('remove', function() {
      let container = Registry.create('scroll');
      let block = Registry.create('header', 'h1');
      container.appendChild(block);
      block.format('header', false);
      expect(container.domNode.innerHTML).toBe('<p></p>');
      expect(container.children.head.statics.blotName).toBe('block');
      expect(container.children.head.formats()).toEqual({});
    });

    it('change', function() {
      let container = Registry.create('scroll');
      let block = Registry.create('block');
      let text = Registry.create('text', 'Test');
      block.appendChild(text);
      container.appendChild(block);
      block.format('header', 'h2');
      expect(container.domNode.innerHTML).toBe('<h2>Test</h2>');
      expect(container.children.head.statics.blotName).toBe('header');
      expect(container.children.head.formats()).toEqual({ header: 'h2' });
      expect(container.children.head.children.length).toBe(1);
      expect(container.children.head.children.head).toBe(text);
    });

    it('split', function() {
      let container = Registry.create('scroll');
      let block = Registry.create('block');
      let text = Registry.create('text', 'Test');
      block.appendChild(text);
      container.appendChild(block);
      let src = 'http://www.w3schools.com/html/mov_bbb.mp4';
      block.insertAt(2, 'video', src);
      expect(container.domNode.innerHTML).toBe(
        `<p>Te</p><video src="${src}"></video><p>st</p>`,
      );
      expect(container.children.length).toBe(3);
      expect(container.children.head.next.statics.blotName).toBe('video');
    });

    it('ignore inline', function() {
      let container = Registry.create('scroll');
      let block = Registry.create('header', 1);
      container.appendChild(block);
      block.format('bold', true);
      expect(container.domNode.innerHTML).toBe('<h1></h1>');
      expect(container.children.head.statics.blotName).toBe('header');
      expect(container.children.head.formats()).toEqual({ header: 'h1' });
    });
  });
});
