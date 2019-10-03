export {
  deepCopy,
  deepCopyAdded,
  deepAssign,
  deepAssignAdded,
};


/**
only works with undefined, null, Number, Symbol, String, Big Int, Object, Array,
warning does not work with cyclic object, Date, regex
does not work with anything created with new
*/
const deepCopy = x => {
  if (typeof x !== `object` || x === null) {
      return x;
  }

  if (Array.isArray(x)) {
      return x.map(deepCopy);
  }

  const copy = {}
  Object.entries(x).forEach(([key, value]) => {
      copy[key] = deepCopy(value);
  });

  return copy;
};

/**
todo
like deepCopy but supports more types
only works with
undefined, null, Number, Symbol, String, Big Int, Object, Array, Date, RegExp, Set, Map
warning does not work with cyclic object
does not work with anything created with new
*/
const deepCopyAdded = x => {
  if (typeof x !== `object` || x === null) {
      return x;
  }
  if (x instanceof Date) {
      return new Date(x);
  }
  if (x instanceof RegExp) {
      return new RegExp(x);
  }
  if (x instanceof Set) {
      return new Set(Array.from(x, deepCopyAdded));
  }
  if (x instanceof Map) {
      const map = new Map();
      // todo keep internal links
      x.forEach((value, key) => {
          map.set(deepCopyAdded(key), deepCopyAdded(value));
      });
      return map;
  }
  if (Array.isArray(x)) {
      return x.map(deepCopy);
  }

  const copy = {}
  Object.entries(x).forEach(([key, value]) => {
      copy[key] = deepCopy(value);
  });

  return copy;
};


/**
Like Object.assign but deep,
does not try to assign partial arrays inside, they are overwritten
only works with undefined, null, Number, Symbol, String, Big Int, Object, Array,
warning does not work with cyclic object, Date, regex
does not work with anything created with new

@param {Object} target must be an object
@param {Object} source1 should be an object, silently discards if not (like Object.assign)

@return {Object} target
*/
const deepAssign = (target, ...sources) => {
  sources.forEach(source => {
      if (!source || typeof source !== `object`) {
          return;
      }
      Object.entries(source).forEach(([key, value]) => {
          if (key === `__proto__`) {
              return;
          }
          if (typeof value !== `object` || value === null) {
              target[key] = value;
              return;
          }
          if (Array.isArray(value)) {
              target[key] = [];
          }
          // value is an Object
          if (typeof target[key] !== `object` || !target[key]) {
              target[key] = {};
          }
          deepAssign(target[key], value);
      });
  });
  return target;
};


/**
Like deepAssign but supports more types,
does not try to assign partial arrays inside, they are overwritten
only works with
undefined, null, Number, Symbol, String, Big Int, Object, Array, Date, Set, Map, RegExp
warning does not work with cyclic objects

@param {Object} target must be an object
@param {Object} source1 should be an object, silently discards if not (like Object.assign)

@return {Object} target
*/
const deepAssignAdded = (target, ...sources) => {
  sources.forEach(source => {
      if (!source || typeof source !== `object`) {
          return;
      }
      Object.entries(source).forEach(([key, value]) => {
          if (key === `__proto__`) {
              return;
          }
          if (typeof value !== `object` || value === null) {
              target[key] = value;
              return;
          }
          if (value instanceof Date) {
              target[key] = new Date(value);
              return;
          }
          if (value instanceof RegExp) {
              target[key] = new RegExp(value);
              return;
          }
          if (value instanceof Set) {
              let tempArray = Array.from(value, deepCopyAdded);
              if (target[key] instanceof Set) {
                  tempArray = tempArray.concat(Array.from(target[key]));
              }
              target[key] = new Set(Array.from(value, deepCopyAdded));
              return;
          }
          if (value instanceof Map) {
              let map;
              if (target[key] instanceof Map) {
                  map = target[key];
              } else {
                  map = new Map();
                  target[key] = map;
              }
              // todo keep internal links
              value.forEach((value, key) => {
                  map.set(deepCopyAdded(key), deepCopyAdded(value));
              });
              return;
          }
          if (Array.isArray(value)) {
              target[key] = [];
          }
          // value is an Object
          if (typeof target[key] !== `object` || !target[key]) {
              target[key] = {};
          }
          deepAssign(target[key], value);
      });
  });
  return target;
};