import Component, { create } from './Component';
import { Timeline, Animation } from '../../week15/animation/animation.js';
import cubicBezier from '../../week15/animation/cubicBezier.js';
import gesture from '../gesture/gesture.js';

const ease = cubicBezier(0.25, 0.1, 0.25, 1.0);

class Carousal extends Component {
  render() {
    let children = this.data.map(url => {
      let ele = <img src={url} />
      ele.addEventListener('dragstart', (e) => { e.preventDefault() })
      return ele
    })

    const component = <div class="carousal">
      {children}
    </div>

    gesture(component.root);

    const timeline = new Timeline();

    let position = 0
    let nextPosition = (position + 1) % this.data.length
    let prePosition = (position - 1 + this.data.length) % this.data.length
    let currentEle = children[position]
    let nextEle = children[nextPosition]
    let preEle = children[prePosition]
    let nextPic = () => {
      nextPosition = (position + 1) % this.data.length

      currentEle = children[position]
      nextEle = children[nextPosition]

      timeline.end();
      timeline.add(new Animation(
        currentEle.style,
        'transform',
        v => `translateX(${v}px)`,
        -300 * position,
        -300 - 300 * position,
        1000, 0, ease
      ), 0);
      timeline.add(new Animation(
        nextEle.style,
        'transform',
        v => `translateX(${v}px)`,
        300 - 300 * nextPosition,
        -300 * nextPosition,
        1000, 0, ease
      ), 0);
      timeline.start();

      position = nextPosition
      
      nextPicTimer = setTimeout(nextPic, 2000)
    }
    
    let nextPicTimer = setTimeout(nextPic, 2000)
    
    let relativeDis = 0;

    component.addEventListener('start', (e) => {
      timeline.pause();
      clearTimeout(nextPicTimer);
      
      currentEle = children[position]
      let currentTranslateX = currentEle.style.transform.match(/translateX\(([^]+)px\)/);
      currentTranslateX = currentTranslateX ? +currentTranslateX[1] : 0;
      relativeDis = currentTranslateX + 300 * position;

      nextPosition = (position + 1) % this.data.length
      prePosition = (position - 1 + this.data.length) % this.data.length

      nextEle = children[nextPosition]
      preEle = children[prePosition]

      currentEle.style.transform = `translateX(${-300 * position + relativeDis}px)`
      preEle.style.transform = `translateX(${-300 + -300 * prePosition + relativeDis}px)`
      nextEle.style.transform = `translateX(${300 + -300 * nextPosition + relativeDis}px)`
    });

    component.addEventListener('panmove', (e) => {
      let dis = e.detail.clientX - e.detail.startX;
      dis = dis > 300 - relativeDis ? 300 - relativeDis : dis;
      dis = dis < - relativeDis - 300 ? - relativeDis - 300 : dis;
      currentEle.style.transform = `translateX(${-300 * position + dis + relativeDis}px)`
      preEle.style.transform = `translateX(${-300 + -300 * prePosition + dis + relativeDis}px)`
      nextEle.style.transform = `translateX(${300 + -300 * nextPosition + dis + relativeDis}px)`
    })

    component.addEventListener('end', (e) => {
      let offset = 0
      let dis = e.detail.clientX - e.detail.startX;
      dis = dis > 300 - relativeDis ? 300 - relativeDis : dis;
      dis = dis < - relativeDis - 300 ? - relativeDis - 300 : dis;
      
      if (dis < -150 || (e.detail.isFlick && dis < 0)) {
        offset = 1
      } else if ((dis > 150) || (e.detail.isFlick && dis > 0)) {
        offset = -1
      }
      
      timeline.end();
      timeline.add(new Animation(
        currentEle.style,
        'transform',
        v => `translateX(${v}px)`,
        -300 * position + dis + relativeDis,
        -offset * 300 + -300 * position,
        1000, 0, ease
      ), 0);
      timeline.add(new Animation(
        preEle.style,
        'transform',
        v => `translateX(${v}px)`,
        -300 + -300 * prePosition + dis + relativeDis,
        -offset * 300 + -300 + -300 * prePosition,
        1000, 0, ease
      ), 0);

      timeline.add(new Animation(
        nextEle.style,
        'transform',
        v => `translateX(${v}px)`,
        300 + -300 * nextPosition + dis + relativeDis,
        -offset * 300 + 300 + -300 * nextPosition,
        1000, 0, ease
      ), 0);
      timeline.start();

      position = offset > 0 ? nextPosition : offset < 0 ? prePosition : position

      nextPicTimer = setTimeout(nextPic, 2000)
    })


    return component
  }

  mountTo(Node) {
    this.root = this.render().root;
    Node.appendChild(this.root);
  }
}

let data = [
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]

export default <Carousal data={data} />
