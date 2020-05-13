### 表达式，类型转换

right-hand side: 
  Member、New、Call

left-hand side: 
  Update、Unary、Exponential、Multiplicative、Additive、Shift、Relationship、Equality、Bitwise、Logical、Condition

#### 数字转字符串，字符串转数字
```javascript
const convertStringToNumber = (string, radix = 10) => {
  const chars = string.split('');
  let number = 0;

  let i = 0;
  while (i < chars.length && chars[i] !== '.') {
    number = number * radix;
    number += chars[i].codePointAt(0) - '0'.codePointAt(0);
    i++;
  }

  if (chars[i] === '.') {
    i++;
  }

  let fraction = 1;
  while (i < chars.length) {
    fraction = fraction / radix;
    number += (chars[i].codePointAt(0) - '0'.codePointAt(0)) * fraction;
    i++;
  }

  return number;
}

const convertNumberToString = (number, radix = 10) => {
  let sign = number < 0;
  number = sign ? -number : number;
  let i = 0
  while (Math.abs(number - Math.round(number)) > Number.EPSILON) {
    number = number * radix;
    i++
  }
  
  let string = '';
  let j = 0;
  while (number > 0) {
    if (i !== 0 && i === j) {
      string = '.' + string;
    }
    string = number % radix + string;
    j++;
    number = Math.floor(number / radix);
  }
  
  if (j === 0) {
    string = '0';
  } else if (i === j){
    string = '0.' + string
  }

  return (sign ? '-' : '') + string;
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