
export function create(Cls, attributes, ...children) {
  let component = null
  if (typeof Cls === 'string') {
    component = new Wrapper(Cls)
  } else {
    component = new Cls()
  }
  for(let attr in attributes) {
    component.setAttribute(attr, attributes[attr]);
  }

  let visit = (children) => {
    for(let child of children) {
      if (typeof child === 'string') {
        child = new Text(child)
      }
      if (child instanceof Array) {
        visit(child)
        continue
      }
      component.appendChild(child)
    }
  }
  visit(children)
  
  return component
}

export class Component {

  constructor() {
    this.children = []
    this.root = document.createElement('div')
  }

  set class(val) {
    console.log('class', val)
  }

  setAttribute(attr, val) {
    this[attr] = val
    this.root.setAttribute(attr, val)
  }

  appendChild(child) {
    this.children.push(child)
    this.root.appendChild(child.root)
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

  addEventListener(){
    this.root.addEventListener(...arguments)
  }

  get style() {
    return this.root.style
  }
}

class Text extends Component {
  constructor (text) {
    super()
    this.root = document.createTextNode(text)
  }
}

// class Carousal extends Component {
//   render() {
//     let children = this.data.map(url => {
//       let ele = <img src={url} />
//       ele.addEventListener('dragstart', (e) => { e.preventDefault() })
//       return ele
//     })

//     this.root = <div class="carousal">
//       {children}
//     </div>

//     let position = 0
//     let nextPic = () => {
//       let currentEle = children[position]
//       let nextPosition = (position + 1) % this.data.length
//       let nextEle = children[nextPosition]

//       currentEle.style.transition = 'ease 0s'
//       nextEle.style.transition = 'ease 0s'
//       nextEle.style.transform = `translateX(${100 - 100 * nextPosition}%)`

//       setTimeout(() => {
//         currentEle.style.transition = ''
//         nextEle.style.transition = ''
//         currentEle.style.transform = `translateX(${-100 - 100 * position}%)`
//         nextEle.style.transform = `translateX(${-100 * nextPosition}%)`
//         position = nextPosition
//       }, 1000)

//       setTimeout(nextPic, 2000)
//     }

//     setTimeout(nextPic, 2000)

//     this.root.addEventListener('mousedown', (e) => {
//       let nextPosition = (position + 1) % this.data.length
//       let prePosition = (position - 1 + this.data.length) % this.data.length

//       let currentEle = children[position]
//       let nextEle = children[nextPosition]
//       let preEle = children[prePosition]

//       currentEle.style.transition = 'ease 0s'
//       nextEle.style.transition = 'ease 0s'
//       preEle.style.transition = 'ease 0s'

//       currentEle.style.transform = `translateX(${-300 * position}px)`
//       preEle.style.transform = `translateX(${-300 + -300 * prePosition}px)`
//       nextEle.style.transform = `translateX(${300 + -300 * nextPosition}px)`

//       let clientX = e.clientX
//       let clientY = e.clientY
//       function move(e) {
//         currentEle.style.transform = `translateX(${-300 * position + e.clientX - clientX}px)`
//         preEle.style.transform = `translateX(${-300 + -300 * prePosition + e.clientX - clientX}px)`
//         nextEle.style.transform = `translateX(${300 + -300 * nextPosition + e.clientX - clientX}px)`
//       }
//       document.addEventListener('mousemove', move)

//       function mouseup(e) {
//         let offset = 0
//         if (e.clientX - clientX < -150) {
//           offset = 1
//         } else if (e.clientX - clientX > 150) {
//           offset = -1
//         }

//         currentEle.style.transition = ''
//         nextEle.style.transition = ''
//         preEle.style.transition = ''

//         currentEle.style.transform = `translateX(${-offset * 300 + -300 * position}px)`
//         preEle.style.transform = `translateX(${-offset * 300 + -300 + -300 * prePosition}px)`
//         nextEle.style.transform = `translateX(${-offset * 300 + 300 + -300 * nextPosition}px)`

//         position = offset > 0 ? nextPosition : offset < 0 ? prePosition : position

//         document.removeEventListener('mousemove', move)
//         document.removeEventListener('mouseup', mouseup)
//       }
//       document.addEventListener('mouseup', mouseup)
//     })

//     return this.root
//   }

//   mountTo(Node){
//     Node.appendChild(this.render().root)
//   }
// }

// let data = [
//   "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
//   "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
//   "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
//   "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
// ]

// let component = <Carousal data={data} />

// component.mountTo(document.body)
// console.log(component)