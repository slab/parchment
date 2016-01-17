"use strict"

describe('InlineBlot', function() {
  it('format ordering', function() {
    let container1 = Registry.create('block');
    container1.appendChild(Registry.create('text', 'Test'));
    let container2 = Registry.create('block');
    container2.appendChild(Registry.create('text', 'Test'));
    container1.formatAt(1, 2, 'bold', true);
    container1.formatAt(1, 2, 'italic', true);
    container2.formatAt(1, 2, 'italic', true);
    container2.formatAt(1, 2, 'bold', true);
    let expected = 'T<em><strong>es</strong></em>t';
    expect(container1.domNode.innerHTML).toEqual(expected);
    expect(container2.domNode.innerHTML).toEqual(expected);
  });

  it('format invalid', function() {
    let boldBlot = Registry.create('bold');
    boldBlot.appendChild(Registry.create('text', 'Test'));
    let original = boldBlot.domNode.outerHTML;
    expect(function() {
      boldBlot.format('nonexistent', true);
    }).not.toThrowError(/\[Parchment\]/);
    expect(boldBlot.domNode.outerHTML).toEqual(original);
  });

  it('format existing', function() {
    let italicBlot = Registry.create('italic');
    let boldBlot = Registry.create('bold');
    boldBlot.appendChild(Registry.create('text', 'Test'));
    italicBlot.appendChild(boldBlot);
    let original = italicBlot.domNode.outerHTML;
    expect(function() {
      italicBlot.formatAt(0, 4, 'bold', true);
      italicBlot.formatAt(0, 4, 'italic', true);
    }).not.toThrowError(/\[Parchment\]/);
    expect(italicBlot.domNode.outerHTML).toEqual(original);
  });

  it('format removal nonexistent', function() {
    let container = Registry.create('block');
    let italicBlot = Registry.create('italic');
    italicBlot.appendChild(Registry.create('text', 'Test'));
    container.appendChild(italicBlot);
    let original = italicBlot.domNode.outerHTML;
    expect(function() {
      italicBlot.formatAt(0, 4, 'bold', false);
    }).not.toThrowError(/\[Parchment\]/);
    expect(italicBlot.domNode.outerHTML).toEqual(original);
  });

  it('delete + unwrap', function() {
    let node = document.createElement('p');
    node.innerHTML = '<em><strong>Test</strong></em>!';
    let container = Registry.create(node);
    container.deleteAt(0, 4);
    expect(container.children.length).toEqual(1);
    expect(container.children.head.getValue()).toEqual('!');
  });

  it('getFormat()', function() {
    let italic = document.createElement('em');
    italic.style.color = 'red';
    italic.innerHTML = '<strong>Test</strong>!';
    let blot = Registry.create(italic);
    let formats = blot.getFormat();
    expect(formats).toEqual({ italic: true, color: 'red' });
  });

  it('change', function() {
    let container = Registry.create('block');
    let script = Registry.create('script', 'sup');
    container.appendChild(script);
    script.format('script', 'sub');
    expect(container.domNode.innerHTML).toEqual('<sub></sub>');
    expect(container.children.head.getFormat()).toEqual({ script: 'sub' });
  });
});
