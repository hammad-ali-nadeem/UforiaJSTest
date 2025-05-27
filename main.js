// 1. Deep Clone
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (hash.has(obj)) return hash.get(obj);

  let clone;
  if (obj instanceof Date) clone = new Date(obj);
  else if (Array.isArray(obj)) clone = [];
  else if (obj instanceof RegExp) clone = new RegExp(obj);
  else clone = Object.create(Object.getPrototypeOf(obj));

  hash.set(obj, clone);

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], hash);
    }
  }

  return clone;
}

// 2. Debounce Function
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// 3. Flatten Nested Array
function flatten(arr) {
  return arr.reduce((flat, toFlatten) => 
    flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), 
  []);
}

// 4. Deep Equality
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (a.constructor !== b.constructor) return false;

  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }

  return true;
}

// 5. String to Camel Case
function toCamelCase(str) {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => 
    c ? c.toUpperCase() : ''
  ).replace(/^./, firstChar => firstChar.toLowerCase());
}

// 6. Memoize Function
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn.apply(this, args));
    }
    return cache.get(key);
  };
}

// 7. Parse Query String
function parseQuery(queryString) {
  const params = {};
  const query = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  
  query.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
    }
  });

  return params;
}

// 8. Curry Function
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...moreArgs) {
        return curried.apply(this, args.concat(moreArgs));
      };
    }
  };
}

// Test Functions
function showResult(elementId, result) {
  const container = document.getElementById(elementId);
  container.textContent = typeof result === 'object' 
    ? JSON.stringify(result, null, 2) 
    : String(result);
  container.classList.remove('hidden');
}

function testDeepClone() {
  const original = { a: 1, b: { c: 2 }, d: new Date() };
  const cloned = deepClone(original);
  showResult('deepCloneResult', {
    original,
    cloned,
    isSameReference: original.b === cloned.b,
    isDeepEqual: deepEqual(original, cloned)
  });
}

function testDebounce() {
  const debouncedLog = debounce(() => {
    console.log('Debounced!');
    showResult('debounceResult', 'Check console after 500ms delay!');
  }, 500);
  debouncedLog();
}

function testFlatten() {
  const arr = [1, [2, [3, 4], 5]];
  showResult('flattenResult', {
    original: arr,
    flattened: flatten(arr)
  });
}

function testDeepEqual() {
  const obj1 = { a: 1, b: { c: 2 } };
  const obj2 = { a: 1, b: { c: 2 } };
  const obj3 = { a: 1, b: { c: 3 } };
  showResult('deepEqualResult', {
    'obj1 vs obj2': deepEqual(obj1, obj2),
    'obj1 vs obj3': deepEqual(obj1, obj3)
  });
}

function testToCamelCase() {
  const str = 'hello-world_test';
  showResult('camelCaseResult', {
    original: str,
    camelCase: toCamelCase(str)
  });
}

function testMemoize() {
  const memoAdd = memoize((a, b) => a + b);
  const firstCall = memoAdd(2, 3);
  const secondCall = memoAdd(2, 3);
  showResult('memoizeResult', {
    firstCall,
    secondCall,
    isSame: firstCall === secondCall
  });
}

function testParseQuery() {
  const query = '?foo=1&bar=2&name=John%20Doe';
  showResult('parseQueryResult', {
    query,
    parsed: parseQuery(query)
  });
}

function testCurry() {
  const curriedAdd = curry((a, b, c) => a + b + c);
  const result = curriedAdd(1)(2)(3);
  showResult('curryResult', {
    'curriedAdd(1)(2)(3)': result
  });
}