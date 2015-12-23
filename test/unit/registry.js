describe('Registry', function() {
  describe('create()', function() {
    it('name', function() {
      var blot = Registry.create('bold');
      expect(blot instanceof BoldBlot).toBe(true);
      expect(blot.statics.blotName).toBe('bold');
    });

    it('node', function() {
      var node = document.createElement('strong');
      var blot = Registry.create(node);
      expect(blot instanceof BoldBlot).toBe(true);
      expect(blot.statics.blotName).toBe('bold');
    });

    it('invalid', function() {
      expect(function() {
        Registry.create(BoldBlot);
      }).toThrow();
    });
  });

  describe('define()', function() {
    it('invalid', function() {
      expect(function() {
        Registry.define({});
      }).toThrow();
    });
  });

  describe('match()', function() {
    it('class', function() {
      var node = document.createElement('em');
      node.setAttribute('class', 'blot-bold');
      expect(Registry.match(node)).toBe(BoldBlot);
    });

    it('type mismatch', function() {
      var match = Registry.match('italic', Registry.Scope.ATTRIBUTE);
      expect(match).not.toBeTruthy();
    });

    it('level mismatch', function() {
      var match = Registry.match('italic', Registry.Scope.BLOCK);
      expect(match).not.toBeTruthy();
    });

    it('either level', function() {
      var match = Registry.match('italic', Registry.Scope.BLOCK | Registry.Scope.INLINE);
      expect(match).toBe(ItalicBlot);
    });

    it('level and type match', function() {
      var match = Registry.match('italic', Registry.Scope.INLINE & Registry.Scope.BLOT);
      expect(match).toBe(ItalicBlot);
    });

    it('level and type mismatch', function() {
      var match = Registry.match('italic', Registry.Scope.INLINE & Registry.Scope.ATTRIBUTE);
      expect(match).not.toBeTruthy();
    });

    it('level and type mismatch', function() {
      var match = Registry.match('italic', Registry.Scope.BLOCK & Registry.Scope.BLOT);
      expect(match).not.toBeTruthy();
    });
  });
});
