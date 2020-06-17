function matchDescendant(selector, element) {
  let selectorParts = selector.match(/[^>\[\]\(\)]+?([\[\(][^]*?\>[^]*?[\]\)])?[^\>\[\]\(\)]*?\s|[^\s\(\)\[\]]+?([\[\(][^]*?\s[^]*?[\]\)])?[^\s\[\]\(\)]*?\>|[^]+$/g).reverse();
  if (!matchSibling(selectorParts[0], element)) {
    return false;
  }
  let j = 0, sPointer = element;
  let pointer = sPointer.parentElement;
  let i = 1;
  while (pointer && i < selectorParts.length && i > 0) {
    let [parts, combinator] = selectorParts[i].match(/^([^]+?)([>\s]*)$/).slice(1, 3);
    if (combinator !== '>') {
      j = i;
      sPointer = pointer;
    }
    if (matchSibling(parts, pointer)) {
      i++;
    } else {
      if (combinator === '>') {
        i = j;
        pointer = sPointer;
      }
    }
    pointer = pointer.parentElement;
  }
  return i === selectorParts.length;
}

function matchSibling(selector, element) {
  let selectorParts = selector.match(/[^\+\[\]\(\)]+?([\[\(]][^]*?\+[^]*?[\]\)])?[^\+\(\)\[\]]*?~|[^~\(\)\[\]]+?([\[\(][^]*?\~[^]*?[\]\)])?[^~\[\]\(\)]*?\+|[^]+$/g).reverse();
  if (!matchCompound(selectorParts[0], element)) {
    return false;
  }
  if (selectorParts.length === 1) return true;
  let parentElement = element.parentElement;
  if (!parentElement) return false;
  let j = 0, sIndex = Array.prototype.indexOf.call(parentElement.children, element);
  let pointerIndex = sIndex - 1;
  let i = 1;
  while (pointerIndex > -1 && i < selectorParts.length && i > 0) {
    let [parts, combinator] = selectorParts[i].match(/^([^]+?)([\+~]*)$/).slice(1, 3);
    if (combinator !== '+') {
      j = i;
      sIndex = pointerIndex;
    }
    if (matchCompound(parts, parentElement.children[pointerIndex])) {
      i++;
    } else {
      if (combinator === '+') {
        i = j;
        pointerIndex = sIndex;
      }
    }
    pointerIndex -= 1;
  }
  return i === selectorParts.length;
}

function matchCompound(parts, element) {
  return parts.match(/^(\*|[a-z]+)|[#\.][a-z_-][a-z0-9_-]*|\[[a-z]+=[^]*?\]|\:[^\:]+/g).every(part => {
    if (!element) return false;
    if (part === '*') return true;
    if (part.charAt(0) === '#') {
      return matchID(part, element);
    } else if (part.charAt(0) === '.') {
      return matchClass(part, element);
    } else if (part.charAt(0) === '[') {
      return matchAttr(part, element);
    } else if (part.charAt(0) === ':') {
      return matchPseudoClass(part, element);
    } else {
      return matchType(part, element);
    }
  });
}

function matchID(part, element) {
  return Array.prototype.some.call(element.attributes, v => v.name === 'id' && v.value === part.slice(1));
}

function matchClass(part, element) {
  return Array.prototype.some.call(element.attributes, v => v.name === 'class' && v.value.split(/\s+/).includes(part.slice(1)));
}

function matchAttr(part, element) {
  let matchedArr = part.match(/\[([a-z]+)([\^\$\*\~\|]?=)?([^]*)?\]/);
  let attrName = matchedArr[1].trim();
  let attrMatcher = matchAttr[2];
  let attrValue = matchedArr[3] && matchedArr[3].trim();
  return Array.prototype.some.call(element.attributes, v => {
    if (v.name === attrName) {
      if (!attrMatcher) {
        return true;
      } else if (v.value == null) {
        return false;
      } if (attrMatcher.charAt(0) === '=') {
        return v.value === attrValue;
      } else if (attrMatcher.charAt(0) === '^') {
        return v.value.indexOf(attrValue) === 0;
      } else if (attrMatcher.charAt(0) === '$') {
        return v.value.lastIndexOf(attrValue) === v.value.length - attrValue.length;
      } else if (attrMatcher.charAt(0) === '*') {
        return v.value.includes(attrValue);
      } else if (attrMatcher.charAt(0) === '~') {
        return v.value.split(' ').includes(attrValue);
      } else if (attrMatcher.charAt(0) === '|') {
        return v.value.split('-')[0] === attrValue;
      }
    }
    return false;
  });
}

function matchType(part, element) {
  return element.tagName.toUpperCase() === part.toUpperCase();
}

function matchPseudoClass(part, element) {
  if (part.includes(':nth-child(')) {
    return matchNthChild(part, element);
  } else if (part.includes(':nth-of-type(')) {
    return matchNthOfType(part, element);
  } else if (part.includes(':not(')) {
    return matchNot(part, element);
  }
  return false;
}

function matchNthChild(part, element) { // odd even -n + 3
  let matchArr = part.match(/^:nth-child\((([0-9]*)n)?\+?([0-9]*)?\)$/);
  let base = matchArr[2];
  let offset = matchArr[3];
  let parentElement = element.parentElement;
  let index = Array.prototype.indexOf.call(parentElement.children, element) + 1;
  return (index - (offset || 0)) % (base || Infinity) === 0;
}

function matchNthOfType(part, element) {
  let matchArr = part.match(/^:nth-of-type\((([0-9]*)n)?\+?([0-9]*)?\)$/);
  let base = matchArr[2];
  let offset = matchArr[3];
  let parentElement = element.parentElement;
  let sameTypeArr = Array.prototype.filter.call(parentElement.children, v => {
    return v.tagName === element.tagName;
  });
  let index = Array.prototype.indexOf.call(sameTypeArr, element) + 1;
  return (index - (offset || 0)) % (base || Infinity) === 0;
}

function matchNot(part, element) {
  let selector = part.match(/^:not\(([^]*)\)$/)[1];
  return !matchDescendant(selector, element);
}

function match(selector, element) {
  return matchDescendant(selector.trim().split(/([\[\(])\s*|\s*([\]\)])|\s*([\s>~+]|[\^\$\~\|\*]?\=)\s*/).join(''), element);
}