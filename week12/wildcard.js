function wildcard(source, pattern) {
  let front = 0
  let back = 0
  for (let i = 0; i < source.length; i++) {
    if (pattern[front] === '*') {
      break
    }
    if (source[i] === pattern[front] || pattern[front] === '?') {
      front++
    } else {
      return false
    }
  }
  for (let i = 0; i < source.length - front; i++) {
    if (pattern[pattern.length - 1 - back] === '*') {
      break
    }
    if (source[source.length - 1 - i] === pattern[pattern.length - 1 - back] || pattern[pattern.length - 1 - back] === '?') {
      back++
    } else {
      return false
    }
  }

  let table = []
  let f = front
  let j = f
  let pj = f
  for (let i = f; i < source.length - back; i++) {
    if (j < pattern.length - back) {
      if (pattern[j] === '*') {
        table[j - front] = '*'
        pj = j + 1
      } else {
        let c = pattern[j] === '?' ? source[i] : pattern[j];
        if (j !== pj && (c === pattern[pj] || pattern[pj] === '?')) {
          pj++
        } else {
          if (pj > f) {
            pj = f
            i--
            continue
          }
          pj = f
        }
      }
      table[j + 1 - front] = pj
    }
    if (table[j - front] == undefined) break
    if (pattern[j] === '*') {
      j++
      f = j
      i--
      continue
    }
    if (source[i] === pattern[j] || pattern[j] === '?') {
      j++
    } else {
      if (j > f) {
        i--
      }
      j = table[j - front]
      pj = j
    }
  }

  for (let i = j; i < pattern.length - back; i++) {
    if (pattern[i] !== '*') {
      return false
    }
  }

  return true
}

// console.log(wildcard('ababcc', '*ab?c*'))
