import Scope from '../../src/scope';
import { HeaderBlot } from '../registry/block';
import { AuthorBlot, BoldBlot, ItalicBlot } from '../registry/inline';

import ShadowBlot from '../../src/blot/abstract/shadow';
import InlineBlot from '../../src/blot/inline';
import BlockBlot from '../../src/blot/block';
import { setupContextBeforeEach } from '../setup';

describe('ctx.registry', function () {
  const ctx = setupContextBeforeEach();

  describe('create()', function () {
    it('name', function () {
      let blot = ctx.registry.create(ctx.scroll, 'bold');
      expect(blot instanceof BoldBlot).toBe(true);
      expect(blot.statics.blotName).toBe('bold');
    });

    it('node', function () {
      let node = document.createElement('strong');
      let blot = ctx.registry.create(ctx.scroll, node);
      expect(blot instanceof BoldBlot).toBe(true);
      expect(blot.statics.blotName).toBe('bold');
    });

    it('block', function () {
      let blot = ctx.registry.create(ctx.scroll, Scope.BLOCK_BLOT);
      expect(blot instanceof BlockBlot).toBe(true);
      expect(blot.statics.blotName).toBe('block');
    });

    it('inline', function () {
      let blot = ctx.registry.create(ctx.scroll, Scope.INLINE_BLOT);
      expect(blot instanceof InlineBlot).toBe(true);
      expect(blot.statics.blotName).toBe('inline');
    });

    it('string index', function () {
      let blot = ctx.registry.create(ctx.scroll, 'header', '2');
      expect(blot instanceof HeaderBlot).toBe(true);
      expect(blot.formats()).toEqual({ header: 'h2' });
    });

    it('invalid', function () {
      expect(() => {
        ctx.registry.create(ctx.scroll, BoldBlot);
      }).toThrowError(/\[Parchment\]/);
    });
  });

  describe('register()', function () {
    it('invalid', function () {
      expect(function () {
        ctx.registry.register({});
      }).toThrowError(/\[Parchment\]/);
    });

    it('abstract', function () {
      expect(function () {
        ctx.registry.register(ShadowBlot);
      }).toThrowError(/\[Parchment\]/);
    });
  });

  describe('find()', function () {
    it('exact', function () {
      let blockNode = document.createElement('p');
      blockNode.innerHTML = '<span>01</span><em>23<strong>45</strong></em>';
      let blockBlot = ctx.registry.create(ctx.scroll, blockNode);
      expect(ctx.registry.find(document.body)).toBeFalsy();
      expect(ctx.registry.find(blockNode)).toBe(blockBlot);
      expect(ctx.registry.find(blockNode.querySelector('span'))).toBe(
        blockBlot.children.head,
      );
      expect(ctx.registry.find(blockNode.querySelector('em'))).toBe(
        blockBlot.children.tail,
      );
      expect(ctx.registry.find(blockNode.querySelector('strong'))).toBe(
        blockBlot.children.tail.children.tail,
      );
      let text01 = blockBlot.children.head.children.head;
      let text23 = blockBlot.children.tail.children.head;
      let text45 = blockBlot.children.tail.children.tail.children.head;
      expect(ctx.registry.find(text01.domNode)).toBe(text01);
      expect(ctx.registry.find(text23.domNode)).toBe(text23);
      expect(ctx.registry.find(text45.domNode)).toBe(text45);
    });

    it('bubble', function () {
      let blockBlot = ctx.registry.create(ctx.scroll, 'block');
      let textNode = document.createTextNode('Test');
      blockBlot.domNode.appendChild(textNode);
      expect(ctx.registry.find(textNode)).toBeFalsy();
      expect(ctx.registry.find(textNode, true)).toEqual(blockBlot);
    });

    it('detached parent', function () {
      let blockNode = document.createElement('p');
      blockNode.appendChild(document.createTextNode('Test'));
      expect(ctx.registry.find(blockNode.firstChild)).toBeFalsy();
      expect(ctx.registry.find(blockNode.firstChild, true)).toBeFalsy();
    });

    it('restricted parent', function () {
      let blockBlot = ctx.registry.create(ctx.scroll, 'block');
      let textNode = document.createTextNode('Test');
      blockBlot.domNode.appendChild(textNode);
      Object.defineProperty(textNode, 'parentNode', {
        get() {
          throw new Error('Permission denied to access property "parentNode"');
        },
      });
      expect(ctx.registry.find(textNode)).toEqual(null);
      expect(ctx.registry.find(textNode, true)).toEqual(null);
    });
  });

  describe('query()', function () {
    it('class', function () {
      let node = document.createElement('em');
      node.setAttribute('class', 'author-blot');
      expect(ctx.registry.query(node)).toBe(AuthorBlot);
    });

    it('type mismatch', function () {
      let match = ctx.registry.query('italic', Scope.ATTRIBUTE);
      expect(match).toBeFalsy();
    });

    it('level mismatch for blot', function () {
      let match = ctx.registry.query('italic', Scope.BLOCK);
      expect(match).toBeFalsy();
    });

    it('level mismatch for attribute', function () {
      let match = ctx.registry.query('color', Scope.BLOCK);
      expect(match).toBeFalsy();
    });

    it('either level', function () {
      let match = ctx.registry.query('italic', Scope.BLOCK | Scope.INLINE);
      expect(match).toBe(ItalicBlot);
    });

    it('level and type match', function () {
      let match = ctx.registry.query('italic', Scope.INLINE & Scope.BLOT);
      expect(match).toBe(ItalicBlot);
    });

    it('level match and type mismatch', function () {
      let match = ctx.registry.query('italic', Scope.INLINE & Scope.ATTRIBUTE);
      expect(match).toBeFalsy();
    });

    it('type match and level mismatch', function () {
      let match = ctx.registry.query('italic', Scope.BLOCK & Scope.BLOT);
      expect(match).toBeFalsy();
    });
  });
});
