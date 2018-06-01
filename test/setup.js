beforeEach(function() {
  this.container = document.createElement('div');
  this.scroll = new ScrollBlot(TestRegistry, this.container);
});

afterEach(function() {
  this.container = null;
  this.scroll = null;
});
