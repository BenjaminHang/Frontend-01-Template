const CSSParser = require('./cssParser');
const layout = require('../week07/layout');

const EOF = Symbol('EOF');

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [{ type: 'document', children: [] }];

let cssParser = new CSSParser();

function emit(token) {
  let top = stack[stack.length - 1];

  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      tagName: token.tagName,
      children: [],
      parent: top,
      attributes: token.attributes
    }

    cssParser.computeCSS(element);

    top.children.push(element);

    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if (top.tagName === token.tagName) {
      stack.pop();

      if (top.tagName === 'style') {
        cssParser.addCSSRules(currentTextNode.content);
      }

      layout(top);
    }

    currentTextNode = null;
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function end() {
  return end;
}

function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    });
    return end;
  } else {
    emit({
      type: 'text',
      content: c
    });
    return data;
  }
}

function tagOpen(c) {
  if (c === '/') {
    currentToken = {
      type: 'endTag',
      tagName: '',
      attributes: []
    }
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: '',
      attributes: []
    }
    return tagName(c);
  } else {
    return data(c);
  }
}

function endTagOpen(c) {
  if (c === EOF) {
    emit('EOF');
    return end;
  } else if (c.match(/^[a-zA-Z]$/)) {
    return tagName(c);
  } else {
    return endTagOpen;
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else {
    currentToken.tagName += c;
    return tagName;
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
    emit('EOF');
    return end;
  } else {
    return beforeAttributeName(c);
  }
}

function beforeAttributeName(c) {
  if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
    return beforeAttributeValue;
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function afterAttributeName(c) {
  if (c === EOF) {
    emit('EOF')
    return end;
  } else if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else {
    return data;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]/) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeName;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === '\'') {
    return singleQuotedAttributeValue;
  } else {
    return unQuotedAttributeValue(c);
  }
}

function unQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]/)) {
    currentToken.attributes.push(currentAttribute);
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken.attributes.push(currentAttribute);
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken.attributes.push(currentAttribute);
    emit(currentToken);
    return data;
  } else {
    currentAttribute.value += c;
    return unQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c === '\'') {
    return afterQuotedAttributeValue;
  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    return afterQuotedAttributeValue;
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}


function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]/)) {
    currentToken.attributes.push(currentAttribute);
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken.attributes.push(currentAttribute);
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken.attributes.push(currentAttribute);
    emit(currentToken);
    return data;
  } else {
    return beforeAttributeName(c);
  }
}

module.exports.parseHTML = function (html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0];
};
