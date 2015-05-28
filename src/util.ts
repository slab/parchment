export function copy(source, target = {}) {
  return Object.keys(source).reduce(function(memo, key) {
    memo[key] = source[key];
    return memo;
  }, target);
}

export function inherit(ClassObject, SuperClass) {
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
  for (var prop in ClassObject) {
    if (ClassObject.hasOwnProperty(prop)) {
      if (typeof ClassObject[prop] === 'function') {
        SubClass.prototype[prop] = ClassObject[prop];
      } else {
        SubClass[prop] = ClassObject[prop];
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
