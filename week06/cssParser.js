const css = require('css');

let rules = [];

function match(element, selector) {
  let pointer = null;
  return selector.split('>').reverse().every(parts => {
    pointer = pointer ? pointer.parent : element;
    return parts.match(/^[a-z]+|[#\.][a-z_-][a-z0-9_-]*|\[[a-z]+=[^]*\]/g).every((part) => {
      if (!pointer || pointer.type === 'document') return false;
      if (part.charAt(0) === '#') {
        let attr = pointer.attributes.find(v => v.name === 'id' && v.value === part.slice(1));
        if(attr) {
          return true
        }
      } else if (part.charAt(0) === '.') {
        let attr = pointer.attributes.find(v => v.name === 'class');
        if (attr && attr.value.split(/\s+/).includes(part.slice(1))) {
          return true;
        }
      } else if (part.charAt(0) === '[') {
        let matchedArr = part.match(/\[([a-z]+)=([^]*)\]/);
        let attrName = matchedArr[1];
        let attrValue = matchedArr[2];
        let attr = pointer.attributes.find(v => v.name === attrName && v.value === attrValue);
        if (attr) {
          return true
        }
      } else {
        if (pointer.tagName === part) {
          return true;
        }
      }
      return false;
    });
  });
}

function specificity(selector) {
  let p = [0, 0, 0, 0];
  selector.split('>').reverse().forEach(parts => {
    parts.match(/^[a-z]+|[#\.][a-z_-][a-z0-9_-]*|\[[a-z]+=[^]*\]/g).forEach((part) => {
      if (part.charAt(0) === '#') {
        p[1]++;
      } else if (part.charAt(0) === '.') {
        p[2]++;
      } else {
        p[3]++;
      }
    });
  });
  return p;
}

function compare(sp1, sp2) {
  let index = sp1.findIndex((s, i) => {
    return s !== sp2[i];
  });
  return index == undefined ? true : sp1[index] > sp2[index];
}

module.exports = class CSSParser {

  constructor() {
    this.rules = []
  }

  addCSSRules(text) {
    let ast = css.parse(text);
    this.rules.push(...ast.stylesheet.rules);
  }

  computeCSS(element) {
    if (!element.computedStyle) {
      element.computedStyle = {};
      let styleAttr = element.attributes.find(attr => attr.name === 'style');
      if (styleAttr) {
        let ast = css.parse(`* {${styleAttr.value}}`);
        let computedStyle = element.computedStyle;
        for (let declaration of ast.stylesheet.rules[0].declarations) {
          if (!computedStyle[declaration.property]) {
            computedStyle[declaration.property] = {}
          }
          computedStyle[declaration.property].specificity = [1, 0, 0 ,0];
          computedStyle[declaration.property].value = declaration.value;
        }
      }
    }
    for(let rule of this.rules) {
      rule.selectors.forEach(selector => {
        let selectorParts = selector.split(/\s+/).reverse();
        if(!match(element, selectorParts[0])) {
          return;
        }
        let pointer = element.parent;
        let i = 1;
        while(pointer.type !== 'document' && i < selectorParts.length) {
          if (match(pointer, selectorParts[i])) {
            i++;
          }
          pointer = pointer.parent;
        }
        if (i === selectorParts.length) {
          let sp = specificity(selector);
          let computedStyle = element.computedStyle;
          for (let declaration of rule.declarations) {
            if (!computedStyle[declaration.property]) {
              computedStyle[declaration.property] = {}
            }
            if (!computedStyle[declaration.property].specificity) {
              computedStyle[declaration.property].specificity = sp;
              computedStyle[declaration.property].value = declaration.value;
            } else {
              if (compare(sp, computedStyle[declaration.property].specificity)) {
                computedStyle[declaration.property].value = declaration.value;
                computedStyle[declaration.property].specificity = sp;
              }
            }
          }
        }
      });
    }
  }
}
