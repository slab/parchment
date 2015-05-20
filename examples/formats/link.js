var Link = Parchment.define({
  init: function(value) {
    var a = document.createElement(this.statics.tagName);
    a.href = value;
    return a;
  },
  formats: function() {
    return { link: this.domNode.href };
  },
  nodeName: 'link',
  tagName: 'A'
}, Parchment.Inline);
