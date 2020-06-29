function* tokenize(source) {
  let reg = /([0-9]+)|([ ]+)|([\r\n]+)|(\+)|(\-)|(\*)|(\/)|(\()|(\))/g;
  let dictionary = ['Number', 'Whitespace', 'LineTerminator', '+', '-', '*', '/', '(', ')'];
  while (reg.lastIndex < source.length) {
    let res = {type: null, value: null};
    let match = reg.exec(source);
    if (!match) {
      break;
    }
    for (let i = 1; i < dictionary.length + 1; i++) {
      if (match[i] != undefined) {
        res.type = dictionary[i - 1];
      }
    }
    res.value = match[0]
    yield res
  }

  yield {type: 'EOF'}
}

let source = [];

for(let token of tokenize('(1 + 2) * 3 / (4 - 5) + 6 * 7')) {
  if (token.type !== 'Whitespace' && token.type !== 'LineTerminator') {
    source.push(token)
  }
}

expression(source)

function expression(source) {
  if (source[0].type === 'AdditiveExpression' && source[1].type === 'EOF') {
    return source[0]
  }
  additiveExpression(source)
  return expression(source)
}

function primaryExpression(source) {
  if (source[0].type === 'Number') {
    let node = {
      type: 'PrimaryExpression',
      children: source.shift()
    }
    source.unshift(node)
  }
  if (source[0].type === '(') {
    let node = {
      type: 'PrimaryExpression',
      children: [source.shift()]
    }
    additiveExpression(source)
    node.children.push(source.shift())
    if (source[0].type === ')') {
      node.children.push(source.shift())
    } else {
      throw new Error(') is not matched')
    }
    source.unshift(node)
  }
  if (source[0].type === 'PrimaryExpression') {
    return source[0]
  }
}

function additiveExpression(source) {
  if (source[0].type !== 'AdditiveExpression') {
    multiplicativeExpression(source);
  }

  if (source[0].type === 'MultiplicativeExpression') {
    let node = {
      type: 'AdditiveExpression',
      children: source.shift()
    }
    source.unshift(node)
  }

  if (source[0].type === 'AdditiveExpression' && ['+', '-'].includes(source[1].type)) {
    let node = {
      type: 'AdditiveExpression',
      children: [source.shift(), source.shift()]
    }
    multiplicativeExpression(source)
    node.children.push(source.shift())
    source.unshift(node)
    return additiveExpression(source)
  }
  if (source[0].type === 'AdditiveExpression') {
    return source[0]
  }
}

function multiplicativeExpression(source) {
  if (source[0].type !== 'MultiplicativeExpression') {
    primaryExpression(source)
  }
  if (source[0].type === 'PrimaryExpression') {
    let node = {
      type: 'MultiplicativeExpression',
      children: source.shift()
    }
    source.unshift(node)
  }
  if (source[0].type === 'MultiplicativeExpression' && ['*', '/'].includes(source[1].type)) {
    let node = {
      type: 'MultiplicativeExpression',
      children: [source.shift(), source.shift()]
    }
    primaryExpression(source)
    node.children.push(source.shift())
    source.unshift(node);
    return multiplicativeExpression(source)
  }

  if (source[0].type === 'MultiplicativeExpression') {
    return source[0]
  }
}




