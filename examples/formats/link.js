var Link = Parchment.define({
  init: function(value) {
    var a = document.createElement('A');
    a.href = value;
    return a;
  },
  getFormat: function() {
    return [{ link: this.domNode.href }];
  },
  nodeName: 'link',
  tagName: 'A'
}, Parchment.InlineNode);
