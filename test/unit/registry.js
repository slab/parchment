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

  describe('match()', function() {
    it('class', function() {
      let node = document.createElement('em');
      node.setAttribute('class', 'blot-bold');
      expect(Registry.match(node)).toBe(BoldBlot);
    });

    it('type mismatch', function() {
      let match = Registry.match('italic', Registry.Scope.ATTRIBUTE);
      expect(match).toBeFalsy();
    });

    it('level mismatch', function() {
      let match = Registry.match('italic', Registry.Scope.BLOCK);
      expect(match).toBeFalsy();
    });

    it('either level', function() {
      let match = Registry.match('italic', Registry.Scope.BLOCK | Registry.Scope.INLINE);
      expect(match).toBe(ItalicBlot);
    });

    it('level and type match', function() {
      let match = Registry.match('italic', Registry.Scope.INLINE & Registry.Scope.BLOT);
      expect(match).toBe(ItalicBlot);
    });

    it('level match and type mismatch', function() {
      let match = Registry.match('italic', Registry.Scope.INLINE & Registry.Scope.ATTRIBUTE);
      expect(match).toBeFalsy();
    });

    it('type match and level mismatch', function() {
      let match = Registry.match('italic', Registry.Scope.BLOCK & Registry.Scope.BLOT);
      expect(match).toBeFalsy();
    });
  });
});
