import { vi, describe, it, expect, beforeEach } from 'vitest';
import LeafBlot from '../../src/blot/abstract/leaf.js';
import ShadowBlot from '../../src/blot/abstract/shadow.js';
import type {
  BlockBlot,
  Blot,
  InlineBlot,
  TextBlot,
} from '../../src/parchment.js';
import { HeaderBlot } from '../__helpers__/registry/block.js';
import { ImageBlot } from '../__helpers__/registry/embed.js';
import type { ItalicBlot } from '../__helpers__/registry/inline.js';
import { BoldBlot } from '../__helpers__/registry/inline.js';
import { setupContextBeforeEach } from '../setup.js';

describe('Lifecycle', function () {
  const ctx = setupContextBeforeEach();

  describe('create()', function () {
    it('specific tagName', function () {
      const node = BoldBlot.create();
      expect(node).toBeTruthy();
      expect(node.tagName).toEqual(BoldBlot.tagName.toUpperCase());
    });

    it('array tagName index', function () {
      const node = HeaderBlot.create(2);
      expect(node).toBeTruthy();
      const blot = ctx.scroll.create(node) as HeaderBlot;
      expect(blot.formats()).toEqual({ header: 'h2' });
    });

    it('array tagName value', function () {
      const node = HeaderBlot.create('h2');
      expect(node).toBeTruthy();
      const blot = ctx.scroll.create(node) as HeaderBlot;
      expect(blot.formats()).toEqual({ header: 'h2' });
    });

    it('array tagName default', function () {
      const node = HeaderBlot.create();
      expect(node).toBeTruthy();
      const blot = ctx.scroll.create(node) as HeaderBlot;
      expect(blot.formats()).toEqual({ header: 'h1' });
    });

    it('null tagName', function () {
      class NullBlot extends ShadowBlot {}
      expect(NullBlot.create.bind(NullBlot)).toThrowError(/\[Parchment\]/);
    });

    it('className', function () {
      class ClassBlot extends ShadowBlot {
        static className = 'test';
        static tagName = 'span';
        static create() {
          return super.create() as HTMLElement;
        }
      }
      const node = ClassBlot.create();
      expect(node).toBeTruthy();
      expect(node.classList.contains('test')).toBe(true);
      expect(node.tagName).toBe('SPAN');
    });
  });

  describe('optimize()', function () {
    it('unwrap empty inline', function () {
      const node = document.createElement('p');
      node.innerHTML =
        '<span style="color: red;"><strong>Te</strong><em>st</em></span>';
      const block = ctx.scroll.create(node);
      ctx.scroll.appendChild(block);
      const span = ctx.scroll.find(node.querySelector('span')) as InlineBlot;
      span.format('color', false);
      ctx.scroll.optimize();
      expect(ctx.container.innerHTML).toEqual(
        '<p><strong>Te</strong><em>st</em></p>',
      );
    });

    it('unwrap recursive', function () {
      const node = document.createElement('p');
      node.innerHTML = '<em><strong>Test</strong></em>';
      const block = ctx.scroll.create(node);
      ctx.scroll.appendChild(block);
      const text = ctx.scroll.find(
        node.querySelector('strong')?.firstChild as HTMLElement,
      );
      text?.deleteAt(0, 4);
      ctx.scroll.optimize();
      expect(ctx.container.innerHTML).toEqual('');
    });

    it('format merge', function () {
      const node = document.createElement('p');
      node.innerHTML = '<strong>T</strong>es<strong>t</strong>';
      const block = ctx.scroll.create(node);
      ctx.scroll.appendChild(block);
      const text = ctx.scroll.find(node.childNodes[1]);
      text?.formatAt(0, 2, 'bold', true);
      ctx.scroll.optimize();
      expect(ctx.container.innerHTML).toEqual('<p><strong>Test</strong></p>');
      expect(ctx.container.querySelector('strong')?.childNodes.length).toBe(1);
    });

    it('format recursive merge', function () {
      const node = document.createElement('p');
      node.innerHTML =
        '<em><strong>T</strong></em><strong>es</strong><em><strong>t</strong></em>';
      const block = ctx.scroll.create(node);
      ctx.scroll.appendChild(block);
      const target = ctx.scroll.find(node.childNodes[1]);
      target?.wrap('italic', true);
      ctx.scroll.optimize();
      expect(ctx.container.innerHTML).toEqual(
        '<p><em><strong>Test</strong></em></p>',
      );
      expect(ctx.container.querySelector('strong')?.childNodes.length).toBe(1);
    });

    it('remove format merge', function () {
      const node = document.createElement('p');
      node.innerHTML =
        '<strong>T</strong><em><strong>es</strong></em><strong>t</strong>';
      const block = ctx.scroll.create(node);
      ctx.scroll.appendChild(block);
      block.formatAt(1, 2, 'italic', false);
      ctx.scroll.optimize();
      expect(ctx.container.innerHTML).toEqual('<p><strong>Test</strong></p>');
      expect(ctx.container.querySelector('strong')?.childNodes.length).toBe(1);
    });

    it('remove attribute merge', function () {
      const node = document.createElement('p');
      node.innerHTML = '<em>T</em><em style="color: red;">es</em><em>t</em>';
      const block = ctx.scroll.create(node);
      ctx.scroll.appendChild(block);
      block.formatAt(1, 2, 'color', false);
      ctx.scroll.optimize();
      expect(ctx.container.innerHTML).toEqual('<p><em>Test</em></p>');
      expect(ctx.container.querySelector('em')?.childNodes.length).toBe(1);
    });

    it('format no merge attribute mismatch', function () {
      const node = document.createElement('p');
      node.innerHTML =
        '<strong>Te</strong><em><strong style="color: red;">st</strong></em>';
      const block = ctx.scroll.create(node);
      ctx.scroll.appendChild(block);
      block.formatAt(2, 2, 'italic', false);
      ctx.scroll.optimize();
      expect(ctx.container.innerHTML).toEqual(
        '<p><strong>Te</strong><strong style="color: red;">st</strong></p>',
      );
    });

    it('delete + merge', function () {
      const node = document.createElement('p');
      node.innerHTML = '<em>T</em>es<em>t</em>';
      const block = ctx.scroll.create(node);
      ctx.scroll.appendChild(block);
      block.deleteAt(1, 2);
      ctx.scroll.optimize();
      expect(ctx.container.innerHTML).toEqual('<p><em>Tt</em></p>');
      expect(ctx.container.querySelector('em')?.childNodes.length).toBe(1);
    });

    it('unwrap + recursive merge', function () {
      const node = document.createElement('p');
      node.innerHTML =
        '<strong>T</strong><em style="color: red;"><strong>es</strong></em><strong>t</strong>';
      const block = ctx.scroll.create(node);
      ctx.scroll.appendChild(block);
      block.formatAt(1, 2, 'italic', false);
      block.formatAt(1, 2, 'color', false);
      ctx.scroll.optimize();
      expect(ctx.container.innerHTML).toEqual('<p><strong>Test</strong></p>');
      expect(ctx.container.querySelector('strong')?.childNodes.length).toBe(1);
    });

    it('remove text + recursive merge', function () {
      const node = document.createElement('p');
      node.innerHTML = '<em>Te</em>|<em>st</em>';
      const block = ctx.scroll.create(node);
      ctx.scroll.appendChild(block);
      (node.childNodes[1] as Text).data = '';
      ctx.scroll.optimize();
      expect(ctx.container.innerHTML).toEqual('<p><em>Test</em></p>');
      expect(ctx.container.firstChild?.firstChild?.childNodes.length).toBe(1);
    });

    it('insert default child', function () {
      HeaderBlot.defaultChild = ImageBlot;
      const blot = ctx.scroll.create('header') as HeaderBlot;
      expect(blot.domNode.innerHTML).toEqual('');
      blot.optimize();
      HeaderBlot.defaultChild = undefined;
      expect(blot.domNode.outerHTML).toEqual('<h1><img></h1>');
    });
  });

  describe('update()', function () {
    // [p, em, strong, text, image, text, p, em, text]
    const ContentFixture =
      '<p><em style="color: red;"><strong>Test</strong><img>ing</em></p><p><em>!</em></p>';
    type Blots /* corresponds to ContentFixture */ = [
      BlockBlot,
      ItalicBlot,
      BoldBlot,
      TextBlot,
      ImageBlot,
      TextBlot,
      BlockBlot,
      ItalicBlot,
      TextBlot,
    ];
    type UpdateTestContext = {
      checkUpdateCalls: (called: Blot | Blot[]) => void;
      checkValues: (expected: any[]) => void;
      descendants: Blots;
    };
    const updateCtx = {} as UpdateTestContext;
    beforeEach(function () {
      ctx.container.innerHTML = ContentFixture;
      ctx.scroll.update();
      updateCtx.descendants = ctx.scroll.descendants(ShadowBlot) as Blots;
      updateCtx.descendants.forEach(function (blot: ShadowBlot) {
        vi.spyOn(blot, 'update');
      });
      updateCtx.checkUpdateCalls = (called) => {
        updateCtx.descendants.forEach(function (blot) {
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
      updateCtx.checkValues = (expected) => {
        const values = ctx.scroll.descendants(LeafBlot).map(function (leaf) {
          return leaf.value();
        });
        expect(values).toEqual(expected);
      };
    });

    describe('api', function () {
      it('insert text', function () {
        ctx.scroll.insertAt(2, '|');
        ctx.scroll.optimize();
        updateCtx.checkValues(['Te|st', { image: true }, 'ing', '!']);
        expect(ctx.scroll.observer.takeRecords()).toEqual([]);
      });

      it('insert embed', function () {
        ctx.scroll.insertAt(2, 'image', true);
        ctx.scroll.optimize();
        updateCtx.checkValues([
          'Te',
          { image: true },
          'st',
          { image: true },
          'ing',
          '!',
        ]);
        expect(ctx.scroll.observer.takeRecords()).toEqual([]);
      });

      it('delete', function () {
        ctx.scroll.deleteAt(2, 5);
        ctx.scroll.optimize();
        updateCtx.checkValues(['Te', 'g', '!']);
        expect(ctx.scroll.observer.takeRecords()).toEqual([]);
      });

      it('format', function () {
        ctx.scroll.formatAt(2, 5, 'size', '24px');
        ctx.scroll.optimize();
        updateCtx.checkValues(['Te', 'st', { image: true }, 'in', 'g', '!']);
        expect(ctx.scroll.observer.takeRecords()).toEqual([]);
      });
    });

    describe('dom', function () {
      it('change text', function () {
        const textBlot = updateCtx.descendants[3];
        textBlot.domNode.data = 'Te|st';
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(textBlot);
        expect(textBlot.value()).toEqual('Te|st');
      });

      it('add/remove unknown element', function () {
        const unknownElement = document.createElement('unknownElement');
        const unknownElement2 = document.createElement('unknownElement2');
        ctx.scroll.domNode.appendChild(unknownElement);
        unknownElement.appendChild(unknownElement2);
        ctx.scroll.domNode.removeChild(unknownElement);
        ctx.scroll.update();
        updateCtx.checkValues(['Test', { image: true }, 'ing', '!']);
      });

      it('add attribute', function () {
        const attrBlot = updateCtx.descendants[1];
        attrBlot.domNode.setAttribute('id', 'blot');
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(attrBlot);
        expect(attrBlot.formats()).toEqual({
          color: 'red',
          italic: true,
          id: 'blot',
        });
      });

      it('add embed attribute', function () {
        const imageBlot = updateCtx.descendants[4];
        imageBlot.domNode.setAttribute('alt', 'image');
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(imageBlot);
      });

      it('change attributes', function () {
        const attrBlot = updateCtx.descendants[1];
        attrBlot.domNode.style.color = 'blue';
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(attrBlot);
        expect(attrBlot.formats()).toEqual({ color: 'blue', italic: true });
      });

      it('remove attribute', function () {
        const attrBlot = updateCtx.descendants[1];
        attrBlot.domNode.removeAttribute('style');
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(attrBlot);
        expect(attrBlot.formats()).toEqual({ italic: true });
      });

      it('add child node', function () {
        const italicBlot = updateCtx.descendants[1];
        italicBlot.domNode.appendChild(document.createTextNode('|'));
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(italicBlot);
        updateCtx.checkValues(['Test', { image: true }, 'ing|', '!']);
      });

      it('add empty family', function () {
        const blockBlot = updateCtx.descendants[0];
        const boldNode = document.createElement('strong');
        const html = ctx.scroll.domNode.innerHTML;
        boldNode.appendChild(document.createTextNode(''));
        blockBlot.domNode.appendChild(boldNode);
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(blockBlot);
        expect(ctx.scroll.domNode.innerHTML).toBe(html);
        expect(ctx.scroll.descendants(ShadowBlot).length).toEqual(
          updateCtx.descendants.length,
        );
      });

      it('move node up', function () {
        const imageBlot = updateCtx.descendants[4];
        imageBlot.domNode.parentNode?.insertBefore(
          imageBlot.domNode,
          imageBlot.domNode.previousSibling,
        );
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(imageBlot.parent);
        updateCtx.checkValues([{ image: true }, 'Test', 'ing', '!']);
      });

      it('move node down', function () {
        const imageBlot = updateCtx.descendants[4];
        imageBlot.domNode.parentNode?.insertBefore(
          imageBlot.domNode.nextSibling!,
          imageBlot.domNode,
        );
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(imageBlot.parent);
        updateCtx.checkValues(['Test', 'ing', { image: true }, '!']);
      });

      it('move node and change', function () {
        const firstBlockBlot = updateCtx.descendants[0];
        const lastItalicBlot = updateCtx.descendants[7];
        firstBlockBlot.domNode.appendChild(lastItalicBlot.domNode);
        lastItalicBlot.domNode.innerHTML = '?';
        ctx.scroll.update();
        updateCtx.checkUpdateCalls([
          firstBlockBlot,
          updateCtx.descendants[6],
          updateCtx.descendants[7],
        ]);
        updateCtx.checkValues(['Test', { image: true }, 'ing', '?']);
      });

      it('add and remove consecutive nodes', function () {
        const italicBlot = updateCtx.descendants[1];
        const imageNode = document.createElement('img');
        const textNode = document.createTextNode('|');
        const refNode = italicBlot.domNode.childNodes[1]; // Old img
        italicBlot.domNode.insertBefore(textNode, refNode);
        italicBlot.domNode.insertBefore(imageNode, textNode);
        italicBlot.domNode.removeChild(refNode);
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(italicBlot);
        updateCtx.checkValues(['Test', { image: true }, '|ing', '!']);
      });

      it('wrap text', function () {
        const textNode = updateCtx.descendants[5].domNode;
        const spanNode = document.createElement('span');
        textNode.parentNode?.removeChild(textNode);
        ctx.scroll.domNode.lastChild?.appendChild(spanNode);
        spanNode.appendChild(textNode);
        ctx.scroll.update();
        updateCtx.checkValues(['Test', { image: true }, '!', 'ing']);
      });

      it('add then remove same node', function () {
        const italicBlot = updateCtx.descendants[1];
        const textNode = document.createTextNode('|');
        italicBlot.domNode.appendChild(textNode);
        italicBlot.domNode.removeChild(textNode);
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(italicBlot);
        updateCtx.checkValues(['Test', { image: true }, 'ing', '!']);
      });

      it('remove child node', function () {
        const imageBlot = updateCtx.descendants[4];
        imageBlot.domNode.parentNode?.removeChild(imageBlot.domNode);
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(updateCtx.descendants[1]);
        updateCtx.checkValues(['Test', 'ing', '!']);
      });

      it('change and remove node', function () {
        const italicBlot = updateCtx.descendants[1];
        // @ts-expect-error This simulates ignored dom mutation
        italicBlot.domNode.color = 'blue';
        italicBlot.domNode.parentNode?.removeChild(italicBlot.domNode);
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(italicBlot.parent);
        updateCtx.checkValues(['!']);
      });

      it('change and remove parent', function () {
        const blockBlot = updateCtx.descendants[0];
        const italicBlot = updateCtx.descendants[1];
        // @ts-expect-error This simulates ignored dom mutation
        italicBlot.domNode.color = 'blue';
        ctx.scroll.domNode.removeChild(blockBlot.domNode);
        ctx.scroll.update();
        updateCtx.checkUpdateCalls([]);
        updateCtx.checkValues(['!']);
      });

      it('different changes to same blot', function () {
        const attrBlot = updateCtx.descendants[1];
        attrBlot.domNode.style.color = 'blue';
        attrBlot.domNode.insertBefore(
          document.createTextNode('|'),
          attrBlot.domNode.childNodes[1],
        );
        ctx.scroll.update();
        updateCtx.checkUpdateCalls(attrBlot);
        expect(attrBlot.formats()).toEqual({ color: 'blue', italic: true });
        updateCtx.checkValues(['Test', '|', { image: true }, 'ing', '!']);
      });
    });
  });
});
