function kmp(source, pattern) {
  if (pattern === '') return true
  let table = [0]
  let j = 0
  for (let i = 1; i < pattern.length; i++) {
    if (i - 1 !== j && pattern[i - 1] === pattern[j]) {
      j++
    } else {
      if (j > 0) {
        i--
        j = 0
        continue
      }
      j = 0
    }
    table[i] = j
  }

  j = 0;
  for(let i = 0; i < source.length; i++) {
    if (source[i] === pattern[j]) {
      j++
    } else {
      if (j > 0) {
        i--
      }
      j = table[j]
    }

    if (j === pattern.length) {
      return true
    }
  }

  return false
}
