var DATA_KEY = '__data';    // TODO switch to const in ES6


export function copy(source, target = {}) {
  return Object.keys(source).reduce(function(memo, key) {
    memo[key] = source[key];
    return memo;
  }, target);
}

export function data(node: Node, key: string, value?: any) {
  if (value != null) {
    if (node[DATA_KEY] == null) node[DATA_KEY] = {};
    node[DATA_KEY][key] = value;
  } else {
    if (node[DATA_KEY] == null) return undefined;
    return node[DATA_KEY][key];
  }
}

export function inherit(Class, SuperClass) {
  var SubClass = function() {
    SuperClass.apply(this, arguments);
  };
  for (var prop in SuperClass) {
    if (SuperClass.hasOwnProperty(prop)) {
      SubClass[prop] = SuperClass[prop];
    }
  }
  var Extender = function() { this.constructor = SubClass; }
  Extender.prototype = SuperClass.prototype;
  SubClass.prototype = new Extender();
  for (var prop in Class) {
    if (Class.hasOwnProperty(prop)) {
      if (typeof Class[prop] === 'function') {
        SubClass.prototype[prop] = Class[prop];
      } else {
        SubClass[prop] = Class[prop];
      }
    }
  }
  return SubClass;
}

export function merge(obj1, obj2) {
  return copy(obj2, copy(obj1));
}

export function mixin(derivedClass: any, baseClasses: any[]) {
  baseClasses.forEach(baseClass => {
    Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
      derivedClass.prototype[name] = baseClass.prototype[name];
    });
  });
}
