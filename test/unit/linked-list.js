describe('LinkedList', function() {
  beforeEach(function() {
    this.list = new LinkedList();
    this.a = { str: 'a' };
    this.b = { str: 'b' };
    this.c = { str: 'c' };
    this.a.getLength = this.b.getLength = this.c.getLength = function() {
      return 3;
    };
  });

  describe('manipulation', function() {
    it('append to empty list', function() {
      this.list.append(this.a);
      expect(this.list.length).toBe(1);
      expect(this.list.head).toBe(this.a);
      expect(this.list.tail).toBe(this.a);
      expect(this.a.prev).toBeUndefined();
      expect(this.a.next).toBeUndefined();
    });

    it('insert to become head', function() {
      this.list.append(this.b);
      this.list.insertBefore(this.a, this.b);
      expect(this.list.length).toBe(2);
      expect(this.list.head).toBe(this.a);
      expect(this.list.tail).toBe(this.b);
      expect(this.a.prev).toBeUndefined();
      expect(this.a.next).toBe(this.b);
      expect(this.b.prev).toBe(this.a);
      expect(this.b.next).toBeUndefined();
    });

    it('insert to become tail', function() {
      this.list.append(this.a);
      this.list.insertBefore(this.b, undefined);
      expect(this.list.length).toBe(2);
      expect(this.list.head).toBe(this.a);
      expect(this.list.tail).toBe(this.b);
      expect(this.a.prev).toBeUndefined();
      expect(this.a.next).toBe(this.b);
      expect(this.b.prev).toBe(this.a);
      expect(this.b.next).toBeUndefined();
    });

    it('insert in middle', function() {
      this.list.append(this.a, this.c);
      this.list.insertBefore(this.b, this.c);
      expect(this.list.length).toBe(3);
      expect(this.list.head).toBe(this.a);
      expect(this.a.next).toBe(this.b);
      expect(this.b.next).toBe(this.c);
      expect(this.list.tail).toBe(this.c);
    });

    it('remove head', function() {
      this.list.append(this.a, this.b);
      this.list.remove(this.a);
      expect(this.list.length).toBe(1);
      expect(this.list.head).toBe(this.b);
      expect(this.list.tail).toBe(this.b);
      expect(this.list.head.prev).toBeUndefined();
      expect(this.list.tail.next).toBeUndefined();
    });

    it('remove tail', function() {
      this.list.append(this.a, this.b);
      this.list.remove(this.b);
      expect(this.list.length).toBe(1);
      expect(this.list.head).toBe(this.a);
      expect(this.list.tail).toBe(this.a);
      expect(this.list.head.prev).toBeUndefined();
      expect(this.list.tail.next).toBeUndefined();
    });

    it('remove inner', function() {
      this.list.append(this.a, this.b, this.c);
      this.list.remove(this.b);
      expect(this.list.length).toBe(2);
      expect(this.list.head).toBe(this.a);
      expect(this.list.tail).toBe(this.c);
      expect(this.list.head.prev).toBeUndefined();
      expect(this.list.tail.next).toBeUndefined();
      expect(this.a.next).toBe(this.c);
      expect(this.c.prev).toBe(this.a);
      // Maintain references
      expect(this.b.prev).toBe(this.a);
      expect(this.b.next).toBe(this.c);
    });

    it('remove only node', function() {
      this.list.append(this.a);
      this.list.remove(this.a);
      expect(this.list.length).toBe(0);
      expect(this.list.head).toBeUndefined();
      expect(this.list.tail).toBeUndefined();
    });

    it('empty', function() {
      this.list.append(this.a, this.b);
      this.list.empty();
      expect(this.list.length).toBe(0);
      expect(this.list.head).toBeUndefined();
      expect(this.list.tail).toBeUndefined();
    });

    it('move', function() {
      this.list.append(this.a, this.b, this.c);
      this.list.remove(this.b);
      this.list.remove(this.a);
      this.list.remove(this.c);
      this.list.append(this.b);
      expect(this.b.prev).toBeUndefined();
      expect(this.b.next).toBeUndefined();
    });
  });

  describe('iteration', function() {
    beforeEach(function() {
      this.spy = {
        callback: function() {
          return arguments;
        }
      };
      spyOn(this.spy, 'callback');
    });

    it('iterate over empty list', function() {
      this.list.forEach(this.spy.callback)
      expect(this.spy.callback.calls.count()).toBe(0)
    });

    it('iterate non-head start', function() {
      this.list.append(this.a, this.b, this.c);
      var next = this.list.iterator(this.b);
      var b = next();
      var c = next();
      var d = next();
      expect(b).toBe(this.b);
      expect(c).toBe(this.c);
      expect(d).toBeUndefined();
    });

    it('find', function() {
      this.list.append(this.a, this.b, this.c);
      expect(this.list.find(0)).toEqual([this.a, 0]);
      expect(this.list.find(2)).toEqual([this.a, 2]);
      expect(this.list.find(3, true)).toEqual([this.a, 3]);
      expect(this.list.find(3)).toEqual([this.b, 0]);
      expect(this.list.find(4)).toEqual([this.b, 1]);
      expect(this.list.find(10)).toEqual([null, 0]);
    });

    it('offset', function() {
      this.list.append(this.a, this.b, this.c);
      expect(this.list.offset(this.a)).toBe(0);
      expect(this.list.offset(this.b)).toBe(3);
      expect(this.list.offset(this.c)).toBe(6);
      expect(this.list.offset({})).toBe(-1);
    });

    it('forEach', function() {
      this.list.append(this.a, this.b, this.c);
      this.list.forEach(this.spy.callback);
      expect(this.spy.callback.calls.count()).toBe(3);
      var result = this.spy.callback.calls.all().reduce(function(memo, call) {
        return memo + call.args[0].str;
      }, '');
      expect(result).toBe('abc');
    });

    it('map', function() {
      this.list.append(this.a, this.b, this.c);
      var arr = this.list.map(function(node) {
        return node.str;
      });
      expect(arr).toEqual(['a', 'b', 'c']);
    });

    it('reduce', function() {
      this.list.append(this.a, this.b, this.c);
      var memo = this.list.reduce(function(memo, node) {
        return memo + node.str;
      }, '');
      expect(memo).toBe('abc');
    });

    it('forEachAt', function() {
      this.list.append(this.a, this.b, this.c);
      this.list.forEachAt(3, 3, this.spy.callback);
      expect(this.spy.callback.calls.count()).toBe(1);
      expect(this.spy.callback.calls.first().args).toEqual([this.b, 0, 3]);
    });

    it('forEachAt none', function() {
      this.list.append(this.a, this.b);
      this.list.forEachAt(1, 0, this.spy.callback);
      expect(this.spy.callback.calls.count()).toBe(0);
    });

    it('forEachAt partial nodes', function() {
      this.list.append(this.a, this.b, this.c);
      this.list.forEachAt(1, 7, this.spy.callback);
      expect(this.spy.callback.calls.count()).toBe(3);
      var calls = this.spy.callback.calls.all();
      expect(calls[0].args).toEqual([this.a, 1, 2]);
      expect(calls[1].args).toEqual([this.b, 0, 3]);
      expect(calls[2].args).toEqual([this.c, 0, 2]);
    });

    it('forEachAt at part of single node', function() {
      this.list.append(this.a, this.b, this.c);
      this.list.forEachAt(4, 1, this.spy.callback);
      expect(this.spy.callback.calls.count()).toBe(1);
      expect(this.spy.callback.calls.first().args).toEqual([this.b, 1, 1]);
    });
  });
});
