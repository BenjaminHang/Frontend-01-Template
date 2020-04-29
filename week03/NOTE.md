### 表达式，类型转换

right hand-side: 
  Member、New、Call

left hand-side: 
  Update、Unary、Exponential、Multiplicative、Additive、Shift、Relationship、Equality、Bitwise、Logical、Condition

#### 数字转字符串，字符串转数字
```javascript
const convertStringToNumber = (string, hex = 10) => {
  const chars = string.split('');
  let number = 0;

  let i = 0;
  while (i < chars.length && chars[i] !== '.') {
    number = number * hex;
    number += chars[i].codePointAt(0) - '0'.codePointAt(0);
    i++;
  }

  if (chars[i] === '.') {
    i++;
  }

  let fraction = 1;
  while (i < chars.length) {
    fraction = fraction / hex;
    number += (chars[i].codePointAt(0) - '0'.codePointAt(0)) * fraction;
    i++;
  }

  return number;
}

const convertNumberToString = (number, hex = 10) => {
  let integer = Math.floor(number);
  let fraction = number - integer;
  let string = '';

  while (integer > 0) {
    string = integer % hex + string;
    integer = Math.floor(integer / hex);
  }

  if (fraction > 0) {
    string += '.';
  }


  while (fraction > 0) {
    let integer = Math.floor(fraction * hex);
    string += integer;
    fraction = fraction * hex - integer;
  }

  return string;
}
```

### 语句，对象

#### 简单语句

  * Expression Statement
  * Empty Statement
  * Debugger Statement
  * Throw Statement
  * Continue Statement
  * Break Statement
  * Return Statement

#### 组合语句

  * Block Statement
  * Iteration

#### 声明

  * Function Declaration
  * Generator Declaration
  * Async Function Declaration
  * Async Generator Declaration
  * Variable Statement
  * Class Declaration
  * Lexical Declaration

#### 标签、循环、break、continue

  * Labelled Statement
  * Iteration Statement
  * Continue Statement
  * Break Statement
  * Switch Statement

#### Runtime

  * Completion Record
  * Lexical Environment

#### JavaScript 标准里有哪些对象

##### 基本对象

  * Number、String、Boolean、Object、Symbol

##### 基础功能和数据结构

  * Array、Date、RegExp、Promise、Proxy、Map、WeakMap、Set、WeakSet、Function

##### 错误类型

  * Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError

##### 二进制操作

  * ArrayBuffer、SharedArrayBuffer、DateView

##### 带类型的数组

  * Float32Array、Float64Array、Int8Array、Int16Array、Int32Array、UInt8Array、UInt16Array、UInt32Array、UInt8ClampedArray