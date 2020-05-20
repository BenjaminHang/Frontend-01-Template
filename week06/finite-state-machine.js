function match(pattern, string) {
  let arr = [];
  let end = function() {
    return end;
  }
  let flag = 1;
  for (let i = 0; i < pattern.length + 1; i++) {
    arr.push({
        check: i ? (char) => {
          return pattern[i - 1] === char; 
        } : undefined,
        state: i < pattern.length ? ((_i, _flag) => char => { 
          if (arr[_i + 1].check(char)) {
            return arr[_i + 1].state;
          } else if(arr[_flag].check(char)){
            return arr[_flag].state;
          } else {
            return arr[0].state;
          }
        })(i, (i !== flag && pattern[i - 1] === pattern[flag - 1]) ? ++flag : (flag = 1)) : end
    });
  }
  let state = arr[0].state;
  for(let i = 0; i < string.length; i++) {
    state = state(string[i]);
  }
  return state === end;
}
