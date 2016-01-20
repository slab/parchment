"use strict"

describe('Registry', function() {
  describe('create()', function() {
    it('name', function() {
      let blot = Registry.create('bold');
      expect(blot instanceof BoldBlot).toBe(true);
      expect(blot.statics.blotName).toBe('bold');
    });

    it('node', function() {
      let node = document.createElement('strong');
      let blot = Registry.create(node);
      expect(blot instanceof BoldBlot).toBe(true);
      expect(blot.statics.blotName).toBe('bold');
    });

    it('invalid', function() {
      expect(function() {
        Registry.create(BoldBlot);
      }).toThrowError(/\[Parchment\]/);
    });
  });

  describe('define()', function() {
    it('invalid', function() {
      expect(function() {
        Registry.register({});
      }).toThrowError(/\[Parchment\]/);
    });
  });

  describe('find()', function() {
    it('exact', function() {
      let blockNode = document.createElement('p');
      blockNode.innerHTML = '<span>01</span><em>23<strong>45</strong></em>';
      let blockBlot = Registry.create(blockNode);
      expect(Registry.find(document.body)).toBeFalsy();
      expect(Registry.find(blockNode)).toBe(blockBlot);
      expect(Registry.find(blockNode.querySelector('span'))).toBe(blockBlot.children.head);
      expect(Registry.find(blockNode.querySelector('em'))).toBe(blockBlot.children.tail);
      expect(Registry.find(blockNode.querySelector('strong'))).toBe(blockBlot.children.tail.children.tail);
      let text01 = blockBlot.children.head.children.head;
      let text23 = blockBlot.children.tail.children.head;
      let text45 = blockBlot.children.tail.children.tail.children.head;
      expect(Registry.find(text01.domNode)).toBe(text01);
      expect(Registry.find(text23.domNode)).toBe(text23);
      expect(Registry.find(text45.domNode)).toBe(text45);
    });

    it('bubble', function() {
      let blockBlot = Registry.create('block');
      let textNode = document.createTextNode('Test');
      blockBlot.domNode.appendChild(textNode);
      expect(Registry.find(textNode)).toBeFalsy();
      expect(Registry.find(textNode, true)).toEqual(blockBlot);
    });

    it('detached parent', function() {
      let blockNode = document.createElement('p');
      blockNode.appendChild(document.createTextNode('Test'));
      expect(Registry.find(blockNode.firstChild)).toBeFalsy();
      expect(Registry.find(blockNode.firstChild, true)).toBeFalsy();
    });
  });

  describe('query()', function() {
    it('class', function() {
      let node = document.createElement('em');
      node.setAttribute('class', 'blot-bold');
      expect(Registry.query(node)).toBe(BoldBlot);
    });

    it('type mismatch', function() {
      let match = Registry.query('italic', Registry.Scope.ATTRIBUTE);
      expect(match).toBeFalsy();
    });

    it('level mismatch for blot', function() {
      let match = Registry.query('italic', Registry.Scope.BLOCK);
      expect(match).toBeFalsy();
    });

    it('level mismatch for attribute', function() {
      let match = Registry.query('color', Registry.Scope.BLOCK);
      expect(match).toBeFalsy();
    });

    it('either level', function() {
      let match = Registry.query('italic', Registry.Scope.BLOCK | Registry.Scope.INLINE);
      expect(match).toBe(ItalicBlot);
    });

    it('level and type match', function() {
      let match = Registry.query('italic', Registry.Scope.INLINE & Registry.Scope.BLOT);
      expect(match).toBe(ItalicBlot);
    });

    it('level match and type mismatch', function() {
      let match = Registry.query('italic', Registry.Scope.INLINE & Registry.Scope.ATTRIBUTE);
      expect(match).toBeFalsy();
    });

    it('type match and level mismatch', function() {
      let match = Registry.query('italic', Registry.Scope.BLOCK & Registry.Scope.BLOT);
      expect(match).toBeFalsy();
    });
  });
});
