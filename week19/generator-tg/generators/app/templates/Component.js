export function create(Cls, attributes, ...children) {
  let component = null;
  if (typeof Cls === 'string') {
    component = new Wrapper(Cls);
  } else {
    component = new Cls();
  }
  for (let attr in attributes) {
    component.setAttribute(attr, attributes[attr]);
  }

  let visit = (children) => {
    for (let child of children) {
      if (typeof child === 'string') {
        child = new Text(child);
      }
      if (child instanceof Array) {
        visit(child);
        continue;
      }
      component.appendChild(child);
    }
  };
  visit(children);

  return component;
}

export default class Component {

  constructor() {
    this.children = [];
    this.root = document.createElement('div');
  }

  set class(val) {
    console.log('class', val);
  }

  setAttribute(attr, val) {
    this[attr] = val;
    this.root.setAttribute(attr, val);
  }

  appendChild(child) {
    this.children.push(child);
    this.root.appendChild(child.root);
  }

  mountTo(Node) {
    Node.appendChild(this.root);
  }
}

class Wrapper extends Component {
  constructor(tag) {
    super();
    this.root = document.createElement(tag);
  }

  addEventListener() {
    this.root.addEventListener(...arguments);
  }

  get style() {
    return this.root.style;
  }
}

class Text extends Component {
  constructor(text) {
    super();
    this.root = document.createTextNode(text);
  }
}
