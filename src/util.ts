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
  for (let prop in SuperClass) {
    if (SuperClass.hasOwnProperty(prop)) {
      SubClass[prop] = SuperClass[prop];
    }
  }
  var Extender = function() { this.constructor = SubClass; }
  Extender.prototype = SuperClass.prototype;
  SubClass.prototype = new Extender();
  for (let prop in ClassObject) {
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

// Shallow object comparison
export function isEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  for (let prop in obj1) {
    if (obj1[prop] !== obj2[prop]) return false;
  }
  return true;
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
