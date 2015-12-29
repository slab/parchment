"use strict"

describe('Lifecycle', function() {
  describe('optimize()', function() {
    it('unwrap empty inline', function() {
      let node = document.createElement('div');
      node.innerHTML = '<p><span style="color: red;"><strong>Te</strong><em>st</em></span></p>';
      let container = Registry.create(node);
      let span = Blot.findBlot(node.querySelector('span'));
      span.format('color', false);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><strong>Te</strong><em>st</em></p>');
    });

    it('unwrap recursive', function() {
      let node = document.createElement('div');
      node.innerHTML = '<p><em><strong>Test</strong></em></p>';
      let container = Registry.create(node);
      let text = Blot.findBlot(node.querySelector('strong').firstChild);
      text.deleteAt(0, 4);
      container.optimize();
      expect(node.innerHTML).toEqual('<p></p>');
    });

    it('format merge', function() {
      let node = document.createElement('div');
      node.innerHTML = '<p><strong>T</strong>es<strong>t</strong></p>';
      let container = Registry.create(node);
      let text = Blot.findBlot(node.firstChild.childNodes[1]);
      text.format('bold', true);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><strong>Test</strong></p>');
      expect(node.querySelector('strong').childNodes.length).toBe(1);
    });

    it('format recursive merge', function() {
      let node = document.createElement('div');
      node.innerHTML = '<p><em><strong>T</strong></em><strong>es</strong><em><strong>t</strong></em></p>';
      let container = Registry.create(node);
      let paragraph = Blot.findBlot(node.querySelector('p'));
      paragraph.formatAt(1, 2, 'italic', true);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><em><strong>Test</strong></em></p>');
      expect(node.querySelector('strong').childNodes.length).toBe(1);
    });

    it('remove format merge', function() {
      let node = document.createElement('div');
      node.innerHTML = '<p><strong>T</strong><em><strong>es</strong></em><strong>t</strong></p>';
      let container = Registry.create(node);
      let paragraph = Blot.findBlot(node.querySelector('p'));
      paragraph.formatAt(1, 2, 'italic', false);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><strong>Test</strong></p>');
      expect(node.querySelector('strong').childNodes.length).toBe(1);
    });

    it('format no merge attribute mismatch', function() {
      let node = document.createElement('div');
      node.innerHTML = '<p><strong>Te</strong><em><strong style="color: red;">st</strong></em></p>';
      let container = Registry.create(node);
      let paragraph = Blot.findBlot(node.querySelector('p'));
      paragraph.formatAt(2, 2, 'italic', false);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><strong>Te</strong><strong style="color: red;">st</strong></p>');
    });

    it('delete + merge', function() {
      let node = document.createElement('div');
      node.innerHTML = '<p><em>T</em>es<em>t</em></p>';
      let container = Registry.create(node);
      let paragraph = Blot.findBlot(node.querySelector('p'));
      paragraph.deleteAt(1, 2);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><em>Tt</em></p>');
      expect(node.querySelector('em').childNodes.length).toBe(1);
    });

    it('unwrap + recursive merge', function() {
      let node = document.createElement('div');
      node.innerHTML = '<p><strong>T</strong><em style="color: red;"><strong>es</strong></em><strong>t</strong></p>';
      let container = Registry.create(node);
      let paragraph = Blot.findBlot(node.querySelector('p'));
      container.formatAt(1, 2, 'italic', false);
      container.formatAt(1, 2, 'color', false);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><strong>Test</strong></p>');
      expect(node.querySelector('strong').childNodes.length).toBe(1);
    })
  });
});
