### 编程语言通识

#### BNF(Backus-Naur Form) 巴科斯范式

1. 编写带括号的四则运算产生式

```
<Number> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<DecimalNumber> ::= "0" | (("1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9") <Number>*)
<PrimaryExpression> ::= <DecimalNumber> | ("(" <LogicalExpression> ")")
<MultiplicativeExpression> ::= <PrimaryExpression> | (<MultiplicativeExpression> "*" <PrimaryExpression>) | (<MultiplicativeExpression> "/" <PrimaryExpression>)
<AdditiveExpression> ::= <MultiplicativeExpression> | (<AdditiveExpression> "+" <MultiplicativeExpression>) | (<AdditiveExpression> "-" <MultiplicativeExpression>)
<LogicalExpression> ::= <AdditiveExpression> | (<LogicalExpression> "||" <AdditiveExpression>) | (<LogicalExpression> "&&" <AdditiveExpression>)
```

2. 通过产生式理解乔姆斯基谱系

  * 0型 无限制文法  
    `? ::= ?`
  * 1型 上下文相关文法  
    `?<A>? ::= ?<B>?`
  * 2型 上下文无关文法  
    `<A> ::= ?`
  * 3型 正则文法
    `<A> ::= <A>?`

### 词法, 类型

### 作业

1. 写一个正则表达式 匹配所有 Number 直接量

```javascript
let reg1 = /^-?\d+\.?\d*$|^-?\d*\.?\d+$/ // 匹配10进制数
let reg2 = /^\d+[eE][\+\-]?\d+$/ // 科学计数法
let reg3 = /^0[bB][01]+$/ // 二进制
let reg4 = /^0[oO][0-7]+$/ // 八进制
let reg5 = /^0[xX][0-9a-fA-F]+$/ // 十六进制

let reg = /^-?\d+\.?\d*$|^-?\d*\.?\d+$|^\d+[eE][\+\-]?\d+$|^0[bB][01]+$|^0[oO][0-7]+$|^0[xX][0-9a-fA-F]+$/
```

2. 写一个 UTF-8 Encoding 的函数

参考网上写法
```javascript
var writeUTF = function (str, isGetBytes) {
  var back = [];
  var byteSize = 0;
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    if (0x00 <= code && code <= 0x7f) {
          byteSize += 1;
          back.push(code);
    } else if (0x80 <= code && code <= 0x7ff) {
          byteSize += 2;
          back.push((192 | (31 & (code >> 6))));
          back.push((128 | (63 & code)))
    } else if ((0x800 <= code && code <= 0xd7ff) 
            || (0xe000 <= code && code <= 0xffff)) {
      byteSize += 3;
      back.push((224 | (15 & (code >> 12))));
      back.push((128 | (63 & (code >> 6))));
      back.push((128 | (63 & code)))
    }
  }
  for (i = 0; i < back.length; i++) {
      back[i] &= 0xff;
  }
  if (isGetBytes) {
      return back
  }
  if (byteSize <= 0xff) {
      return [0, byteSize].concat(back);
  } else {
      return [byteSize >> 8, byteSize & 0xff].concat(back);
  }
}
```

3. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

```javascript
let reg =/^(("(([^"\\(\u000A|\u000D|\u2028|\u2029)]|(\u000A|\u000D|\u2028|\u2029)|\u2029|\\((['"\\bfnrtv]|[^'"\\bfnrtv0-9xu\u000A\u000D\u2028\u2029])|(0(?![0-9]))|(x[0-9a-fA-F]{2})|(u[0-9a-fA-F]{4}|[\u0000-\u10FFFF]))|\\(\u000A|\u000D(?!\u000A)|\u2028|\u2029|\u000D\u000A))+)?")|('(([^'\\(\u000A|\u000D|\u2028|\u2029)]|(\u000A|\u000D|\u2028|\u2029)|\u2029|\\((['"\\bfnrtv]|[^'"\\bfnrtv0-9xu\u000A\u000D\u2028\u2029])|(0(?![0-9]))|(x[0-9a-fA-F]{2})|(u[0-9a-fA-F]{4}|[\u0000-\u10FFFF]))|\\(\u000A|\u000D(?!\u000A)|\u2028|\u2029|\u000D\u000A))+)?'))$/
```