import { describe, it, expect } from 'vitest';
import type { BlockBlot, Leaf } from '../../src/parchment';
import type {
  BoldBlot,
  ItalicBlot,
  ScriptBlot,
} from '../__helpers__/registry/inline';
import { setupContextBeforeEach } from '../setup';

describe('InlineBlot', function () {
  const ctx = setupContextBeforeEach();

  it('format addition', function () {
    const italicBlot = ctx.scroll.create('italic') as ItalicBlot;
    italicBlot.appendChild(ctx.scroll.create('text', 'Test'));
    italicBlot.formatAt(1, 2, 'bold', true);
    expect(italicBlot.domNode.outerHTML).toEqual(
      '<em>T<strong>es</strong>t</em>',
    );
  });

  it('format invalid', function () {
    const boldBlot = ctx.scroll.create('bold') as BoldBlot;
    boldBlot.appendChild(ctx.scroll.create('text', 'Test'));
    const original = boldBlot.domNode.outerHTML;
    expect(function () {
      boldBlot.format('nonexistent', true);
    }).not.toThrowError(/\[Parchment\]/);
    expect(boldBlot.domNode.outerHTML).toEqual(original);
  });

  it('format existing', function () {
    const italicBlot = ctx.scroll.create('italic') as ItalicBlot;
    const boldBlot = ctx.scroll.create('bold') as BoldBlot;
    boldBlot.appendChild(ctx.scroll.create('text', 'Test'));
    italicBlot.appendChild(boldBlot);
    const original = italicBlot.domNode.outerHTML;
    expect(function () {
      boldBlot.formatAt(0, 4, 'bold', true);
      italicBlot.formatAt(0, 4, 'italic', true);
    }).not.toThrowError(/\[Parchment\]/);
    expect(italicBlot.domNode.outerHTML).toEqual(original);
  });

  it('format removal nonexistent', function () {
    const container = ctx.scroll.create('block') as BlockBlot;
    const italicBlot = ctx.scroll.create('italic') as ItalicBlot;
    italicBlot.appendChild(ctx.scroll.create('text', 'Test'));
    container.appendChild(italicBlot);
    const original = italicBlot.domNode.outerHTML;
    expect(function () {
      italicBlot.format('bold', false);
    }).not.toThrowError(/\[Parchment\]/);
    expect(italicBlot.domNode.outerHTML).toEqual(original);
  });

  it('delete + unwrap', function () {
    const node = document.createElement('p');
    node.innerHTML = '<em><strong>Test</strong></em>!';
    const container = ctx.scroll.create(node) as BlockBlot;
    container.deleteAt(0, 4);
    expect((container.children.head as Leaf).value()).toEqual('!');
  });

  it('formats()', function () {
    const italic = document.createElement('em');
    italic.style.color = 'red';
    italic.innerHTML = '<strong>Test</strong>!';
    const blot = ctx.scroll.create(italic) as ItalicBlot;
    expect(blot.formats()).toEqual({ italic: true, color: 'red' });
  });

  it('change', function () {
    const container = ctx.scroll.create('block') as BlockBlot;
    const script = ctx.scroll.create('script', 'sup') as ScriptBlot;
    container.appendChild(script);
    script.format('script', 'sub');
    expect(container.domNode.innerHTML).toEqual('<sub></sub>');
    expect((container.children.head as ScriptBlot).formats()).toEqual({
      script: 'sub',
    });
  });
});
