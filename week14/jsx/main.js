
function create(Cls, attributes, ...children) {
  let component = null
  if (typeof Cls === 'string') {
    component = new Wrapper(Cls)
  } else {
    component = new Cls()
  }

  for(let attr in attributes) {
    component.setAttribute(attr, attributes[attr]);
  }

  for(let child of children) {
    if (typeof child === 'string') {
      child = new Text(child)
    }
    component.appendChild(child)
  }

  return component
}

class Component {

  constructor() {
    this.children = []
    this.root = document.createElement('div')
    this.render()
  }

  set class(val) {
    console.log('class', val)
  }

  setAttribute(attr, val) {
    console.log(attr, val)
  }

  appendChild(child) {
    this.children.push(child)
    this.slot.root.appendChild(child.root)
  }

  render() {
    this.slot = this
  }

  mountTo(Node) {
    Node.appendChild(this.root)
  }
}

class Wrapper extends Component {
  constructor(tag) {
    super()
    this.root = document.createElement(tag)
  }
}

class Text extends Component {
  constructor (text) {
    super()
    this.root = document.createTextNode(text)
  }
}

class Parent extends Component {
  render() {
    this.slot = <div></div>
    let component = <div>
      <header>header</header>
      {this.slot}
      <footer>footer</footer>
    </div>
    this.root = component.root
  }
}

class Child extends Component {

}

let component = <Parent id="parent">
  <Child id="child1">123</Child>
  <child id="child2">456</child>
</Parent>

component.mountTo(document.body)
console.log(component)