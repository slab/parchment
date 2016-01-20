"use strict"

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
      let block = Registry.create('header', 'h1');
      container.appendChild(block);
      block.format('header', 'h2');
      expect(container.domNode.innerHTML).toBe('<h2></h2>');
      expect(container.children.head.statics.blotName).toBe('header');
      expect(container.children.head.formats()).toEqual({ header: 'h2' });
    });
  });
});
