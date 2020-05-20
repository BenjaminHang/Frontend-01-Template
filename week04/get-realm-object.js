// let objProperties = [
//   'eval',
//   'isFinite',
//   'isNaN',
//   'parseFloat',
//   'parseInt',
//   'decodeURI',
//   'decodeURIComponent',
//   'encodeURI',
//   'encodeURIComponent',
//   'Array',
//   'Date',
//   'RegExp',
//   'Promise',
//   'Proxy',
//   'Map',
//   'WeakMap',
//   'Set',
//   'WeakSet',
//   'Function',
//   'Boolean',
//   'String',
//   'Number',
//   'Symbol',
//   'Object',
//   'Error',
//   'EvalError',
//   'RangeError',
//   'ReferenceError',
//   'SyntaxError',
//   'TypeError',
//   'URIError',
//   'ArrayBuffer',
//   'SharedArrayBuffer',
//   'DataView',
//   'Float32Array',
//   'Float64Array',
//   'Int8Array',
//   'Int16Array',
//   'Int32Array',
//   'Uint8Array',
//   'Uint16Array',
//   'Uint32Array',
//   'Uint8ClampedArray',
//   'Atomics',
//   'JSON',
//   'Math',
//   'Reflect'].map(v => {
//     return {
//       path: ['window', v],
//       object: this[v]
//     };
//   });

let objProperties = [{
  path: ['this'],
  object: this
}];
let objSet = new Set();
var categories = ['this'];
var chartNodes = [];
var chartLinks = [];
let i = 0;

while (objProperties.length) {
  let obj = objProperties.shift();
  if(objSet.has(obj.object)){
    continue;
  }

  console.log(i, obj.path.join('.'))
  i++
  objSet.add(obj.object);
  if (obj.path[1] && !categories.includes(obj.path[1])) {
    categories.push(obj.path[1]);
  }
  chartNodes.push({
    name: obj.path.join('.'),
    category: obj.path[1] ? categories.indexOf(obj.path[1]) : 0,
    fixed: false
  });

  chartLinks.push({
    source: obj.path.slice(0, obj.path.length - 1).join('.'),
    target: obj.path.join('.')
  });

  for (let property of Object.getOwnPropertyNames(obj.object)) {
    if (property === 'echarts') continue;
    let propertyDescriptor = Object.getOwnPropertyDescriptor(obj.object, property);
    let value = propertyDescriptor.value;
    if ((value != null && typeof value === "object") || (typeof value === "function")) {
      objProperties.push({
        path: obj.path.concat(property),
        object: value
      })
    }
    
    let getV = propertyDescriptor.get;
    if (getV) {
      objProperties.push({
        path: obj.path.concat(property + '<get>'),
        object: getV
      })
    }

    let setV = propertyDescriptor.set;
    if (setV) {
      objProperties.push({
        path: obj.path.concat(property + '<set>'),
        object: setV
      })
    }
  }

  let proto = Object.getPrototypeOf(obj.object);
  if ((proto != null && typeof proto === "object") || (typeof proto === "function")) {
    objProperties.push({
      path: obj.path.concat('__proto__'),
      object: proto
    })
  }
}
