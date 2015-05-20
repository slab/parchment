var Image = Parchment.define({
  nodeName: 'image',
  tagName: 'IMG',
  init: function(value) {
    var img = document.createElement(this.statics.tagName);
    img.setAttribute('src', value.src);
    if (value.alt != null) {
      img.setAttribute('alt', value.alt);
    }
    return img;
  },
  values: function() {
    var value = {};
    value.type = this.statics.nodeName;
    value.src = this.domNode.getAttribute('src');
    if (this.domNode.hasAttribute('alt')) {
      value.alt = this.domNode.getAttribute('alt');
    }
    return value;
  }
}, Parchment.Embed);
