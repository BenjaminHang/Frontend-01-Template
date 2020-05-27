### 有限状态机

#### 挑战题：我们如何用状态机处理完全未知的 pattern（选做）

```javascript
function match(pattern, string) {
  let arr = [];
  let end = function () {
    return end;
  }
  let flag = 1;
  for (let i = 0; i < pattern.length + 1; i++) {
    arr.push(i < pattern.length ? ((_i, _flag) => char => {
      if (pattern[_i] === char) {
        return arr[_i + 1];
      } else if (pattern[_flag - 1] === char) {
        return arr[_flag];
      } else if (pattern[0] === char) {
        return arr[1];
      } else {
        return arr[0];
      }
    })(i, (i !== flag && pattern[i - 1] === pattern[flag - 1]) ? ++flag : (flag = (pattern[i - 1] === pattern[0] ? 2 : 1))) : end
    );
  }
  let state = arr[0];
  for (let i = 0; i < string.length; i++) {
    state = state(string[i]);
  }
  return state === end;
}
```


