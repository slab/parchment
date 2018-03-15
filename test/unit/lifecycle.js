'use strict';

describe('Lifecycle', function() {
  describe('create()', function() {
    it('specific tagName', function() {
      let node = BoldBlot.create();
      expect(node).toBeTruthy();
      expect(node.tagName).toEqual(BoldBlot.tagName.toUpperCase());
    });

    it('array tagName index', function() {
      let node = HeaderBlot.create(2);
      expect(node).toBeTruthy();
      let blot = Registry.create(node);
      expect(blot.formats()).toEqual({ header: 'h2' });
    });

    it('array tagName value', function() {
      let node = HeaderBlot.create('h2');
      expect(node).toBeTruthy();
      let blot = Registry.create(node);
      expect(blot.formats()).toEqual({ header: 'h2' });
    });

    it('array tagName default', function() {
      let node = HeaderBlot.create();
      expect(node).toBeTruthy();
      let blot = Registry.create(node);
      expect(blot.formats()).toEqual({ header: 'h1' });
    });

    it('null tagName', function() {
      class NullBlot extends ShadowBlot {}
      expect(NullBlot.create.bind(NullBlot)).toThrowError(/\[Parchment\]/);
    });

    it('className', function() {
      class ClassBlot extends ShadowBlot {}
      ClassBlot.className = 'test';
      ClassBlot.tagName = 'span';
      let node = ClassBlot.create();
      expect(node).toBeTruthy();
      expect(node.classList.contains('test')).toBe(true);
      expect(node.tagName).toBe('SPAN');
    });
  });

  describe('optimize()', function() {
    it('unwrap empty inline', function() {
      let node = document.createElement('div');
      node.innerHTML =
        '<p><span style="color: red;"><strong>Te</strong><em>st</em></span></p>';
      let container = Registry.create(node);
      let span = Registry.find(node.querySelector('span'));
      span.format('color', false);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><strong>Te</strong><em>st</em></p>');
    });

    it('unwrap recursive', function() {
      let node = document.createElement('div');
      node.innerHTML = '<p><em><strong>Test</strong></em></p>';
      let container = Registry.create(node);
      let text = Registry.find(node.querySelector('strong').firstChild);
      text.deleteAt(0, 4);
      container.optimize();
      expect(node.innerHTML).toEqual('');
    });

    it('format merge', function() {
      let node = document.createElement('div');
      node.innerHTML = '<p><strong>T</strong>es<strong>t</strong></p>';
      let container = Registry.create(node);
      let text = Registry.find(node.firstChild.childNodes[1]);
      text.formatAt(0, 2, 'bold', true);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><strong>Test</strong></p>');
      expect(node.querySelector('strong').childNodes.length).toBe(1);
    });

    it('format recursive merge', function() {
      let node = document.createElement('div');
      node.innerHTML =
        '<p><em><strong>T</strong></em><strong>es</strong><em><strong>t</strong></em></p>';
      let container = Registry.create(node);
      let target = Registry.find(node.firstChild.childNodes[1]);
      target.wrap('italic', true);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><em><strong>Test</strong></em></p>');
      expect(node.querySelector('strong').childNodes.length).toBe(1);
    });

    it('remove format merge', function() {
      let node = document.createElement('div');
      node.innerHTML =
        '<p><strong>T</strong><em><strong>es</strong></em><strong>t</strong></p>';
      let container = Registry.create(node);
      let paragraph = Registry.find(node.querySelector('p'));
      paragraph.formatAt(1, 2, 'italic', false);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><strong>Test</strong></p>');
      expect(node.querySelector('strong').childNodes.length).toBe(1);
    });

    it('remove attribute merge', function() {
      let node = document.createElement('div');
      node.innerHTML =
        '<p><em>T</em><em style="color: red;">es</em><em>t</em></p>';
      let container = Registry.create(node);
      let paragraph = Registry.find(node.querySelector('p'));
      paragraph.formatAt(1, 2, 'color', false);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><em>Test</em></p>');
      expect(node.querySelector('em').childNodes.length).toBe(1);
    });

    it('format no merge attribute mismatch', function() {
      let node = document.createElement('div');
      node.innerHTML =
        '<p><strong>Te</strong><em><strong style="color: red;">st</strong></em></p>';
      let container = Registry.create(node);
      let paragraph = Registry.find(node.querySelector('p'));
      paragraph.formatAt(2, 2, 'italic', false);
      container.optimize();
      expect(node.innerHTML).toEqual(
        '<p><strong>Te</strong><strong style="color: red;">st</strong></p>',
      );
    });

    it('delete + merge', function() {
      let node = document.createElement('div');
      node.innerHTML = '<p><em>T</em>es<em>t</em></p>';
      let container = Registry.create(node);
      let paragraph = Registry.find(node.querySelector('p'));
      paragraph.deleteAt(1, 2);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><em>Tt</em></p>');
      expect(node.querySelector('em').childNodes.length).toBe(1);
    });

    it('unwrap + recursive merge', function() {
      let node = document.createElement('div');
      node.innerHTML =
        '<p><strong>T</strong><em style="color: red;"><strong>es</strong></em><strong>t</strong></p>';
      let container = Registry.create(node);
      let paragraph = Registry.find(node.querySelector('p'));
      container.formatAt(1, 2, 'italic', false);
      container.formatAt(1, 2, 'color', false);
      container.optimize();
      expect(node.innerHTML).toEqual('<p><strong>Test</strong></p>');
      expect(node.querySelector('strong').childNodes.length).toBe(1);
    });

    it('remove text + recursive merge', function() {
      let node = document.createElement('div');
      node.innerHTML = '<p><em>Te</em>|<em>st</em></p>';
      let container = Registry.create(node);
      node.firstChild.childNodes[1].data = '';
      container.optimize();
      expect(node.innerHTML).toEqual('<p><em>Test</em></p>');
      expect(node.firstChild.firstChild.childNodes.length).toBe(1);
    });

    it('insert default child', function() {
      HeaderBlot.defaultChild = ImageBlot;
      let blot = Registry.create('header');
      expect(blot.domNode.innerHTML).toEqual('');
      blot.optimize();
      HeaderBlot.defaultChild = undefined;
      expect(blot.domNode.outerHTML).toEqual('<h1><img></h1>');
    });
  });

  describe('update()', function() {
    beforeEach(function() {
      let div = document.createElement('div');
      div.innerHTML =
        '<p><em style="color: red;"><strong>Test</strong><img>ing</em></p><p><em>!</em></p>';
      this.container = Registry.create(div);
      // [p, em, strong, text, image, text, p, em, text]
      this.descendants = this.container.descendants(ShadowBlot);
      this.descendants.forEach(function(blot) {
        spyOn(blot, 'update').and.callThrough();
      });
      this.checkUpdateCalls = called => {
        this.descendants.forEach(function(blot) {
          if (
            called === blot ||
            (Array.isArray(called) && called.indexOf(blot) > -1)
          ) {
            expect(blot.update).toHaveBeenCalled();
          } else {
            expect(blot.update).not.toHaveBeenCalled();
          }
        });
      };
      this.checkValues = expected => {
        let values = this.container.descendants(LeafBlot).map(function(leaf) {
          return leaf.value();
        });
        expect(values).toEqual(expected);
      };
    });

    describe('api', function() {
      it('insert text', function() {
        this.container.insertAt(2, '|');
        this.container.optimize();
        this.checkValues(['Te|st', { image: true }, 'ing', '!']);
        expect(this.container.observer.takeRecords()).toEqual([]);
      });

      it('insert embed', function() {
        this.container.insertAt(2, 'image', true);
        this.container.optimize();
        this.checkValues([
          'Te',
          { image: true },
          'st',
          { image: true },
          'ing',
          '!',
        ]);
        expect(this.container.observer.takeRecords()).toEqual([]);
      });

      it('delete', function() {
        this.container.deleteAt(2, 5);
        this.container.optimize();
        this.checkValues(['Te', 'g', '!']);
        expect(this.container.observer.takeRecords()).toEqual([]);
      });

      it('format', function() {
        this.container.formatAt(2, 5, 'size', '24px');
        this.container.optimize();
        this.checkValues(['Te', 'st', { image: true }, 'in', 'g', '!']);
        expect(this.container.observer.takeRecords()).toEqual([]);
      });
    });

    describe('dom', function() {
      it('change text', function() {
        let textBlot = this.descendants[3];
        textBlot.domNode.data = 'Te|st';
        this.container.update();
        this.checkUpdateCalls(textBlot);
        expect(textBlot.value()).toEqual('Te|st');
      });

      it('add/remove unknown element', function() {
        let unknownElement = document.createElement('unknownElement');
        let unknownElement2 = document.createElement('unknownElement2');
        this.container.domNode.appendChild(unknownElement);
        unknownElement.appendChild(unknownElement2);
        this.container.domNode.removeChild(unknownElement);
        this.container.update();
        this.checkValues(['Test', { image: true }, 'ing', '!']);
      });

      it('add attribute', function() {
        let attrBlot = this.descendants[1];
        attrBlot.domNode.setAttribute('id', 'blot');
        this.container.update();
        this.checkUpdateCalls(attrBlot);
        expect(attrBlot.formats()).toEqual({
          color: 'red',
          italic: true,
          id: 'blot',
        });
      });

      it('add embed attribute', function() {
        let imageBlot = this.descendants[4];
        imageBlot.domNode.setAttribute('alt', 'image');
        this.container.update();
        this.checkUpdateCalls(imageBlot);
      });

      it('change attributes', function() {
        let attrBlot = this.descendants[1];
        attrBlot.domNode.style.color = 'blue';
        this.container.update();
        this.checkUpdateCalls(attrBlot);
        expect(attrBlot.formats()).toEqual({ color: 'blue', italic: true });
      });

      it('remove attribute', function() {
        let attrBlot = this.descendants[1];
        attrBlot.domNode.removeAttribute('style');
        this.container.update();
        this.checkUpdateCalls(attrBlot);
        expect(attrBlot.formats()).toEqual({ italic: true });
      });

      it('add child node', function() {
        let italicBlot = this.descendants[1];
        italicBlot.domNode.appendChild(document.createTextNode('|'));
        this.container.update();
        this.checkUpdateCalls(italicBlot);
        this.checkValues(['Test', { image: true }, 'ing|', '!']);
      });

      it('add empty family', function() {
        let blockBlot = this.descendants[0];
        let boldNode = document.createElement('strong');
        let html = this.container.innerHTML;
        boldNode.appendChild(document.createTextNode(''));
        blockBlot.domNode.appendChild(boldNode);
        this.container.update();
        this.checkUpdateCalls(blockBlot);
        expect(this.container.innerHTML).toBe(html);
        expect(this.container.descendants(ShadowBlot).length).toEqual(
          this.descendants.length,
        );
      });

      it('move node up', function() {
        let imageBlot = this.descendants[4];
        imageBlot.domNode.parentNode.insertBefore(
          imageBlot.domNode,
          imageBlot.domNode.previousSibling,
        );
        this.container.update();
        this.checkUpdateCalls(imageBlot.parent);
        this.checkValues([{ image: true }, 'Test', 'ing', '!']);
      });

      it('move node down', function() {
        let imageBlot = this.descendants[4];
        imageBlot.domNode.parentNode.insertBefore(
          imageBlot.domNode.nextSibling,
          imageBlot.domNode,
        );
        this.container.update();
        this.checkUpdateCalls(imageBlot.parent);
        this.checkValues(['Test', 'ing', { image: true }, '!']);
      });

      it('move node and change', function() {
        let firstBlockBlot = this.descendants[0];
        let lastItalicBlot = this.descendants[7];
        firstBlockBlot.domNode.appendChild(lastItalicBlot.domNode);
        lastItalicBlot.domNode.innerHTML = '?';
        this.container.update();
        this.checkUpdateCalls([
          firstBlockBlot,
          this.descendants[6],
          this.descendants[7],
        ]);
        this.checkValues(['Test', { image: true }, 'ing', '?']);
      });

      it('add and remove consecutive nodes', function() {
        let italicBlot = this.descendants[1];
        let imageNode = document.createElement('img');
        let textNode = document.createTextNode('|');
        let refNode = italicBlot.domNode.childNodes[1]; // Old img
        italicBlot.domNode.insertBefore(textNode, refNode);
        italicBlot.domNode.insertBefore(imageNode, textNode);
        italicBlot.domNode.removeChild(refNode);
        this.container.update();
        this.checkUpdateCalls(italicBlot);
        this.checkValues(['Test', { image: true }, '|ing', '!']);
      });

      it('wrap text', function() {
        let textNode = this.descendants[5].domNode;
        let spanNode = document.createElement('span');
        textNode.parentNode.removeChild(textNode);
        this.container.domNode.lastChild.appendChild(spanNode);
        spanNode.appendChild(textNode);
        this.container.update();
        this.checkValues(['Test', { image: true }, '!', 'ing']);
      });

      it('add then remove same node', function() {
        let italicBlot = this.descendants[1];
        let textNode = document.createTextNode('|');
        italicBlot.domNode.appendChild(textNode);
        italicBlot.domNode.removeChild(textNode);
        this.container.update();
        this.checkUpdateCalls(italicBlot);
        this.checkValues(['Test', { image: true }, 'ing', '!']);
      });

      it('remove child node', function() {
        let imageBlot = this.descendants[4];
        imageBlot.domNode.parentNode.removeChild(imageBlot.domNode);
        this.container.update();
        this.checkUpdateCalls(this.descendants[1]);
        this.checkValues(['Test', 'ing', '!']);
      });

      it('change and remove node', function() {
        let italicBlot = this.descendants[1];
        italicBlot.domNode.color = 'blue';
        italicBlot.domNode.parentNode.removeChild(italicBlot.domNode);
        this.container.update();
        this.checkUpdateCalls(italicBlot.parent);
        this.checkValues(['!']);
      });

      it('change and remove parent', function() {
        let blockBlot = this.descendants[0];
        let italicBlot = this.descendants[1];
        italicBlot.domNode.color = 'blue';
        this.container.domNode.removeChild(blockBlot.domNode);
        this.container.update();
        this.checkUpdateCalls([]);
        this.checkValues(['!']);
      });

      it('different changes to same blot', function() {
        let attrBlot = this.descendants[1];
        attrBlot.domNode.style.color = 'blue';
        attrBlot.domNode.insertBefore(
          document.createTextNode('|'),
          attrBlot.domNode.childNodes[1],
        );
        this.container.update();
        this.checkUpdateCalls(attrBlot);
        expect(attrBlot.formats()).toEqual({ color: 'blue', italic: true });
        this.checkValues(['Test', '|', { image: true }, 'ing', '!']);
      });
    });
  });
});
