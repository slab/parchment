import type {
  Attributor,
  BlockBlot,
  Formattable,
  InlineBlot,
} from '../../src/parchment';
import type { HeaderBlot } from '../registry/block';
import type { BoldBlot } from '../registry/inline';
import { setupContextBeforeEach } from '../setup';

describe('Attributor', function () {
  const ctx = setupContextBeforeEach();

  it('build', function () {
    let blot = ctx.scroll.create('inline') as InlineBlot;
    blot.domNode.style.color = 'red';
    blot.domNode.style.fontSize = '24px';
    blot.domNode.id = 'blot-test';
    blot.domNode.classList.add('indent-2');
    // Use bracket notation to access private fields as escape hatch
    // https://github.com/microsoft/TypeScript/issues/19335
    blot['attributes'].build();
    expect(Object.keys(blot['attributes']['attributes']).sort()).toEqual(
      ['color', 'size', 'id', 'indent'].sort(),
    );
  });

  it('add to inline', function () {
    let container = ctx.scroll.create('block') as BlockBlot;
    let boldBlot = ctx.scroll.create('bold') as BoldBlot;
    container.appendChild(boldBlot);
    boldBlot.format('id', 'test-add');
    expect(boldBlot.domNode.id).toEqual('test-add');
  });

  it('add multiple', function () {
    let node = document.createElement('p');
    node.innerHTML = '<em><strong>0</strong></em>';
    let container = ctx.scroll.create(node);
    container.formatAt(0, 1, 'color', 'red');
    container.formatAt(0, 1, 'size', '18px');
    expect(node.innerHTML).toEqual(
      '<em style="color: red; font-size: 18px;"><strong>0</strong></em>',
    );
  });

  it('add to text', function () {
    let container = ctx.scroll.create('block') as BlockBlot;
    let textBlot = ctx.scroll.create('text', 'Test');
    container.appendChild(textBlot);
    textBlot.formatAt(0, 4, 'color', 'red');
    expect(textBlot.domNode.parentElement?.style.color).toEqual('red');
  });

  it('add existing style', function () {
    let boldBlot = ctx.scroll.create('bold') as BoldBlot;
    boldBlot.format('color', 'red');
    expect(boldBlot.domNode.style.color).toEqual('red');
    let original = boldBlot.domNode.outerHTML;
    expect(function () {
      boldBlot.format('color', 'red');
    }).not.toThrow();
    expect(boldBlot.domNode.outerHTML).toEqual(original);
  });

  it('replace existing class', function () {
    let blockBlot = ctx.scroll.create('block') as BlockBlot;
    blockBlot.format('indent', 2);
    expect(blockBlot.domNode.classList.contains('indent-2')).toBe(true);
    blockBlot.format('indent', 3);
    expect(blockBlot.domNode.classList.contains('indent-2')).toBe(false);
    expect(blockBlot.domNode.classList.contains('indent-3')).toBe(true);
  });

  it('add whitelist style', function () {
    let blockBlot = ctx.scroll.create('block') as BlockBlot;
    blockBlot.format('align', 'right');
    expect(blockBlot.domNode.style.textAlign).toBe('right');
  });

  it('add non-whitelisted style', function () {
    let blockBlot = ctx.scroll.create('block') as BlockBlot;
    blockBlot.format('align', 'justify');
    expect(blockBlot.domNode.style.textAlign).toBeFalsy();
  });

  it('unwrap', function () {
    let container = ctx.scroll.create('block') as BlockBlot;
    let node = document.createElement('strong');
    node.style.color = 'red';
    node.innerHTML = '<em>01</em>23';
    let blot = ctx.scroll.create(node);
    container.appendChild(blot);
    container.formatAt(0, 4, 'bold', false);
    expect(container.domNode.innerHTML).toEqual(
      '<em style="color: red;">01</em><span style="color: red;">23</span>',
    );
  });

  it('remove', function () {
    let container = ctx.scroll.create('block') as BlockBlot;
    let node = document.createElement('strong');
    node.innerHTML = 'Bold';
    node.style.color = 'red';
    node.style.fontSize = '24px';
    container.domNode.classList.add('indent-5');
    container.domNode.id = 'test-remove';
    let boldBlot = ctx.scroll.create(node);
    container.appendChild(boldBlot);
    container.formatAt(1, 2, 'color', false);
    expect(container.children.length).toEqual(3);
    let targetNode = boldBlot.next?.domNode as HTMLElement;
    expect(targetNode.style.color).toEqual('');
    container.formatAt(1, 2, 'size', false);
    expect(targetNode.style.fontSize).toEqual('');
    expect(targetNode.getAttribute('style')).toEqual(null);
    container.formatAt(1, 2, 'indent', false);
    expect(targetNode.classList.contains('indent-5')).toBe(false);
    container.formatAt(1, 2, 'id', false);
    expect(container.domNode.id).toBeFalsy();
  });

  it('remove nonexistent', function () {
    let container = ctx.scroll.create('block') as BlockBlot;
    let node = document.createElement('strong');
    node.innerHTML = 'Bold';
    let boldBlot = ctx.scroll.create(node) as BoldBlot;
    container.appendChild(boldBlot);
    boldBlot.format('color', false);
    expect(container.domNode.innerHTML).toEqual('<strong>Bold</strong>');
  });

  it('keep class attribute after removal', function () {
    let boldBlot = ctx.scroll.create('bold') as BoldBlot;
    boldBlot.domNode.classList.add('blot');
    boldBlot.format('indent', 2);
    boldBlot.format('indent', false);
    expect(boldBlot.domNode.classList.contains('blot')).toBe(true);
  });

  it('move attribute', function () {
    let container = ctx.scroll.create('block') as BlockBlot;
    let node = document.createElement('strong');
    node.innerHTML = 'Bold';
    node.style.color = 'red';
    let boldBlot = ctx.scroll.create(node);
    container.appendChild(boldBlot);
    container.formatAt(1, 2, 'bold', false);
    expect(container.children.length).toEqual(3);
    expect(boldBlot.next?.statics.blotName).toEqual('inline');
    expect((boldBlot.next as Formattable)?.formats().color).toEqual('red');
  });

  it('wrap with inline', function () {
    let container = ctx.scroll.create('block') as BlockBlot;
    let node = document.createElement('strong');
    node.style.color = 'red';
    let boldBlot = ctx.scroll.create(node);
    container.appendChild(boldBlot);
    boldBlot.wrap('italic');
    expect(node.style.color).toBeFalsy();
    expect(node.parentElement?.style.color).toBe('red');
  });

  it('wrap with block', function () {
    let container = ctx.scroll.create('block') as BlockBlot;
    let node = document.createElement('strong');
    node.style.color = 'red';
    let boldBlot = ctx.scroll.create(node) as BoldBlot;
    container.appendChild(boldBlot);
    boldBlot.wrap('block');
    expect(node.style.color).toBe('red');
    expect(node.parentElement?.style.color).toBeFalsy();
  });

  it('add to block', function () {
    let container = ctx.scroll.create('block') as BlockBlot;
    let block = ctx.scroll.create('header', 'h1') as HeaderBlot;
    container.appendChild(block);
    block.format('align', 'right');
    expect(container.domNode.innerHTML).toBe(
      '<h1 style="text-align: right;"></h1>',
    );
    expect((container.children.head as Formattable)?.formats()).toEqual({
      header: 'h1',
      align: 'right',
    });
  });

  it('missing class value', function () {
    let block = ctx.scroll.create('block');
    let indentAttributor = ctx.scroll.query('indent') as Attributor;
    expect(indentAttributor.value(block.domNode as HTMLElement)).toBeFalsy();
  });

  it('removes quotes from attribute value when checking if canAdd', function () {
    let bold = ctx.scroll.create('bold');
    let familyAttributor = ctx.scroll.query('family') as Attributor;
    const domNode = bold.domNode as HTMLElement;
    expect(familyAttributor.canAdd(domNode, 'Arial')).toBeTruthy();
    expect(familyAttributor.canAdd(domNode, '"Times New Roman"')).toBeTruthy();
    expect(familyAttributor.canAdd(domNode, 'monotype')).toBeFalsy();
    expect(familyAttributor.canAdd(domNode, '"Lucida Grande"')).toBeFalsy();
  });
});
