import Component, { create } from './Component';

class List extends Component {

}

let data = [
  {title: 'cat 1', url: "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg"},
  {title: 'cat 2', url: "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg"},
  {title: 'cat 3', url: "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg"},
  {title: 'cat 4', url: "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"},
]

export default <List data={data}>
  {item =>
    <figure style="display: inline-block;">
      <img width="300" src={item.url}></img>
      <figcaption>{item.title}</figcaption>
    </figure>
  }
</List>
