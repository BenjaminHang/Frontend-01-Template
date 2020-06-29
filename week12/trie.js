class Trie {
  constructor() {
    this.root = Object.create(null)
  }

  insert(word) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      if (!node[word[i]]) {
        node[word[i]] = Object.create(null)
      }
      node = node[word[i]]
    }
    if (!node.$) {
      node.$ = 0
    }
    node.$++
  }

  most() {
    let max = 0
    let maxWord = ''
    // let visit = (node, word) => {
    //   if (node.$ && node.$ > max) {
    //     max = node.$
    //     maxWord = word
    //   } else {
    //     for (let c in node) {
    //       if (c !== '$') {
    //         visit(node[c], word + c)
    //       }
    //     }
    //   }
    // }
    // visit(this.root, '')
    let queue = [{word: '', node: this.root}]
    while(queue.length) {
      let node = queue.pop()
      for(let c in node.node) {
        if (c === '$' && node.node.$ > max) {
          max = node.node.$
          maxWord = node.word
        } else {
          queue.push({word: node.word + c, node: node.node[c]})
        }
      }
    }
    return maxWord;
  }
}

function randomWord(length) {
  let s = ''
  for(i = 0; i < length; i++) {
    s += String.fromCharCode(Math.floor(Math.random() * 26) + 'a'.charCodeAt(0))
  }
  return s
}

function createTrie() {
  let trie = new Trie();
  for (let i = 0; i < 100000; i++) {
    trie.insert(randomWord(4))
  }
  return trie
}
