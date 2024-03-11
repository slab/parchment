import { describe, it, expect } from 'vitest';
import Scope from '../../src/scope.js';
import { HeaderBlot } from '../__helpers__/registry/block.js';
import {
  AuthorBlot,
  BoldBlot,
  ItalicBlot,
} from '../__helpers__/registry/inline.js';

import ShadowBlot from '../../src/blot/abstract/shadow.js';
import InlineBlot from '../../src/blot/inline.js';
import BlockBlot from '../../src/blot/block.js';
import type { Parent } from '../../src/parchment.js';

import { setupContextBeforeEach } from '../setup.js';

describe('ctx.registry', function () {
  const ctx = setupContextBeforeEach();

  describe('create()', function () {
    it('name', function () {
      const blot = ctx.registry.create(ctx.scroll, 'bold');
      expect(blot instanceof BoldBlot).toBe(true);
      expect(blot.statics.blotName).toBe('bold');
    });

    it('node', function () {
      const node = document.createElement('strong');
      const blot = ctx.registry.create(ctx.scroll, node);
      expect(blot instanceof BoldBlot).toBe(true);
      expect(blot.statics.blotName).toBe('bold');
    });

    it('block', function () {
      const blot = ctx.registry.create(ctx.scroll, Scope.BLOCK_BLOT);
      expect(blot instanceof BlockBlot).toBe(true);
      expect(blot.statics.blotName).toBe('block');
    });

    it('inline', function () {
      const blot = ctx.registry.create(ctx.scroll, Scope.INLINE_BLOT);
      expect(blot instanceof InlineBlot).toBe(true);
      expect(blot.statics.blotName).toBe('inline');
    });

    it('string index', function () {
      const blot = ctx.registry.create(ctx.scroll, 'header', '2');
      expect(blot instanceof HeaderBlot && blot.formats()).toEqual({
        header: 'h2',
      });
    });

    it('invalid', function () {
      expect(() => {
        // @ts-expect-error This tests invalid usage
        ctx.registry.create(ctx.scroll, BoldBlot);
      }).toThrowError(/\[Parchment\]/);
    });
  });

  describe('register()', function () {
    it('invalid', function () {
      expect(function () {
        // @ts-expect-error This tests invalid usage
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
      const blockNode = document.createElement('p');
      blockNode.innerHTML = '<span>01</span><em>23<strong>45</strong></em>';
      const blockBlot = ctx.registry.create(ctx.scroll, blockNode) as BlockBlot;
      expect(ctx.registry.find(document.body)).toBeFalsy();
      expect(ctx.registry.find(blockNode)).toBe(blockBlot);
      expect(ctx.registry.find(blockNode.querySelector('span'))).toBe(
        blockBlot.children.head,
      );
      expect(ctx.registry.find(blockNode.querySelector('em'))).toBe(
        blockBlot.children.tail,
      );
      expect(ctx.registry.find(blockNode.querySelector('strong'))).toBe(
        (blockBlot.children.tail as Parent)?.children.tail,
      );
      const text01 = (blockBlot.children.head as Parent).children.head!;
      const text23 = (blockBlot.children.tail as Parent).children.head!;
      const text45 = (
        (blockBlot.children.tail as Parent).children.tail as Parent
      ).children.head!;
      expect(ctx.registry.find(text01.domNode)).toBe(text01);
      expect(ctx.registry.find(text23.domNode)).toBe(text23);
      expect(ctx.registry.find(text45.domNode)).toBe(text45);
    });

    it('bubble', function () {
      const blockBlot = ctx.registry.create(ctx.scroll, 'block');
      const textNode = document.createTextNode('Test');
      blockBlot.domNode.appendChild(textNode);
      expect(ctx.registry.find(textNode)).toBeFalsy();
      expect(ctx.registry.find(textNode, true)).toEqual(blockBlot);
    });

    it('detached parent', function () {
      const blockNode = document.createElement('p');
      blockNode.appendChild(document.createTextNode('Test'));
      expect(ctx.registry.find(blockNode.firstChild)).toBeFalsy();
      expect(ctx.registry.find(blockNode.firstChild, true)).toBeFalsy();
    });

    it('restricted parent', function () {
      const blockBlot = ctx.registry.create(ctx.scroll, 'block');
      const textNode = document.createTextNode('Test');
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
      const node = document.createElement('em');
      node.setAttribute('class', 'author-blot');
      expect(ctx.registry.query(node)).toBe(AuthorBlot);
    });

    it('type mismatch', function () {
      const match = ctx.registry.query('italic', Scope.ATTRIBUTE);
      expect(match).toBeFalsy();
    });

    it('level mismatch for blot', function () {
      const match = ctx.registry.query('italic', Scope.BLOCK);
      expect(match).toBeFalsy();
    });

    it('level mismatch for attribute', function () {
      const match = ctx.registry.query('color', Scope.BLOCK);
      expect(match).toBeFalsy();
    });

    it('either level', function () {
      const match = ctx.registry.query('italic', Scope.BLOCK | Scope.INLINE);
      expect(match).toBe(ItalicBlot);
    });

    it('level and type match', function () {
      const match = ctx.registry.query('italic', Scope.INLINE & Scope.BLOT);
      expect(match).toBe(ItalicBlot);
    });

    it('level match and type mismatch', function () {
      const match = ctx.registry.query(
        'italic',
        Scope.INLINE & Scope.ATTRIBUTE,
      );
      expect(match).toBeFalsy();
    });

    it('type match and level mismatch', function () {
      const match = ctx.registry.query('italic', Scope.BLOCK & Scope.BLOT);
      expect(match).toBeFalsy();
    });
  });
});
