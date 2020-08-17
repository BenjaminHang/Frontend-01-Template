const css = require('css');

module.exports = function(source) {
  let ast = css.parse(source);

  for(let rule in ast.stylesheet.rules) {
    rule.selectors = rule.selectors.map(v => `${v}`);
  }

  return `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(css.stringify(ast))};
    document.documentElement.append(style);
  `;
}
