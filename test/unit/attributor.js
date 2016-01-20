"use strict"

describe('Attributor', function() {
  it('build', function() {
    let blot = Registry.create('inline');
    blot.domNode.style.color = 'red';
    blot.domNode.style.fontSize = '24px';
    blot.domNode.id = 'blot-test'
    blot.domNode.classList.add('indent-2')
    blot.build();
    expect(Object.keys(blot.attributes.attributes).sort()).toEqual(['color', 'size', 'id', 'indent'].sort());
  });

  it('add to inline', function() {
    let container = Registry.create('block');
    let boldBlot = Registry.create('bold');
    container.appendChild(boldBlot);
    boldBlot.format('id', 'test-add');
    expect(boldBlot.domNode.id).toEqual('test-add');
  });

  xit('add to text', function() {
    let container = Registry.create('block');
    let textBlot = Registry.create('text', 'Test');
    container.appendChild(textBlot);
    textBlot.format('color', 'red');
    expect(textBlot.domNode.parentNode.style.color).toEqual('red');
  });

  it('add existing style', function() {
    let boldBlot = Registry.create('bold');
    boldBlot.format('color', 'red');
    expect(boldBlot.domNode.style.color).toEqual('red');
    let original = boldBlot.domNode.outerHTML;
    expect(function() {
      boldBlot.format('color', 'red');
    }).not.toThrow();
    expect(boldBlot.domNode.outerHTML).toEqual(original);
  });

  it('replace existing class', function() {
    let blockBlot = Registry.create('block');
    blockBlot.format('indent', 2);
    expect(blockBlot.domNode.classList.contains('indent-2')).toBe(true);
    blockBlot.format('indent', 3);
    expect(blockBlot.domNode.classList.contains('indent-2')).toBe(false);
    expect(blockBlot.domNode.classList.contains('indent-3')).toBe(true);
  });

  it('add whitelist style', function() {
    let blockBlot = Registry.create('block');
    blockBlot.format('align', 'right');
    expect(blockBlot.domNode.style.textAlign).toBe('right');
  });

  it('add non-whitelisted style', function() {
    let blockBlot = Registry.create('block');
    blockBlot.format('align', 'justify');
    expect(blockBlot.domNode.style.textAlign).toBeFalsy();
  });

  it('remove', function() {
    let container = Registry.create('block');
    let node = document.createElement('strong');
    node.innerHTML = 'Bold';
    node.style.color = 'red';
    node.style.fontSize = '24px';
    container.domNode.classList.add('indent-5');
    node.id = 'test-remove';
    let boldBlot = Registry.create(node);
    container.appendChild(boldBlot);
    container.formatAt(1, 2, 'color', false);
    expect(container.children.length).toEqual(3);
    let targetNode = boldBlot.next.domNode;
    expect(targetNode.style.color).toEqual('');
    container.formatAt(1, 2, 'size', false);
    expect(targetNode.style.fontSize).toEqual('');
    expect(targetNode.getAttribute('style')).toEqual(null);
    // TODO no longer supports multiscope attributors
    // container.formatAt(1, 2, 'id', false);
    // expect(targetNode.id).toBeFalsy();
    container.formatAt(1, 2, 'indent', false);
    expect(targetNode.classList.contains('indent-5')).toBe(false);
  });

  it('remove nonexistent', function() {
    let container = Registry.create('block');
    let node = document.createElement('strong');
    node.innerHTML = 'Bold';
    let boldBlot = Registry.create(node);
    container.appendChild(boldBlot);
    boldBlot.formatAt(1, 2, 'color', false);
    expect(boldBlot.next.domNode.outerHTML).toEqual('<strong>ol</strong>');
  });

  it('keep class attribute after removal', function() {
    let boldBlot = Registry.create('bold');
    boldBlot.domNode.classList.add('blot');
    boldBlot.format('indent', 2);
    boldBlot.format('indent', false);
    expect(boldBlot.domNode.classList.contains('blot')).toBe(true);
  });

  it('move attribute', function() {
    let container = Registry.create('block');
    let node = document.createElement('strong');
    node.innerHTML = 'Bold';
    node.style.color = 'red';
    let boldBlot = Registry.create(node);
    container.appendChild(boldBlot);
    container.formatAt(1, 2, 'bold', false);
    expect(container.children.length).toEqual(3);
    expect(boldBlot.next.statics.blotName).toEqual('inline');
    expect(boldBlot.next.formats().color).toEqual('red');
  });

  it('wrap with block', function() {
    let container = Registry.create('block');
    let node = document.createElement('strong');
    node.style.color = 'red';
    let boldBlot = Registry.create(node);
    container.appendChild(boldBlot);
    boldBlot.wrap('block');
    expect(node.style.color).toBe('red');
  });

  it('add to block', function() {
    let container = Registry.create('scroll');
    let block = Registry.create('header', 'h1');
    container.appendChild(block);
    block.format('align', 'right');
    expect(container.domNode.innerHTML).toBe('<h1 style="text-align: right;"></h1>');
    expect(container.children.head.formats()).toEqual({ header: 'h1', align: 'right' });
  });

  it('invalid class scope add', function() {
    let inline = Registry.create('inline');
    let blockAttributor = Registry.query('indent');
    blockAttributor.add(inline.domNode, 1);
    expect(inline.domNode.classList.contains('indent-1')).toBeFalsy();
    expect(inline.attributes['indent']).toBe(undefined);
  });

  it('invalid scope format', function() {
    let inline = Registry.create('inline');
    inline.format('indent', 1);
    expect(inline.domNode.classList.contains('indent-1')).toBeFalsy();
    expect(inline.attributes['indent']).toBe(undefined);
  });

  it('missing class value', function() {
    let block = Registry.create('block');
    let indentAttributor = Registry.query('indent');
    expect(indentAttributor.value(block.domNode)).toBeFalsy();
  });
});
