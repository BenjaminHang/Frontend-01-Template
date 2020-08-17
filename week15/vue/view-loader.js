const parser = require('../../week06/parser');

module.exports = function(source) {
  const rootNode = parser.parseHTML(source).children[0].children[1];

  function arrToObj(arr) {
    let obj = {};
    arr.forEach(v => {
      obj[v.name] = v.value;
    });
    return obj;
  }

  let visit = (node) => {
    let attributes = arrToObj(node.attributes);
    let childNodes = [];
    for (let child of node.children) {
      if (!child.tagName) continue;
      if (child.children && child.children.length) {
        childNodes.push(visit(child));
      } else {
        let childAttributes = arrToObj(child.attributes);
        childNodes.push(`create(${JSON.stringify(child.tagName)}, ${JSON.stringify(childAttributes)})`);
      }
    }
    return `create(${JSON.stringify(node.tagName)}, ${JSON.stringify(attributes)}, ${childNodes})`;
  }
  const elements = visit(rootNode);

  console.log(elements);
  return `
  import { create, Component } from '../../week14/jsx/main';
  export default class Carousal extends Component {
    render() {
      return ${elements};
    }
    mountTo(Node) {
      Node.appendChild(this.render().root)
    }
  }
  `;
}