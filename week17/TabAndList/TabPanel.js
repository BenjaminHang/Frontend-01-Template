import Component, { create } from './Component';

import './TabPanel.css';

class TabPanel extends Component {

  select(i) {
    this.contents.forEach(v => v.style.display = 'none');
    this.contents[i].style.display = 'block';
  }

  render() {
    this.contents = this.children.map(v => <div class="panel">{v.innerText}</div>)
    this.tabs = this.children.map((v, i) => 
      <span class="tab" onclick={() => this.select(i)}>{v.getAttribute('title')}</span>
    )
    this.select(0);
    return <div class="tab-panel">
      <div>{this.tabs}</div>
      <div>{this.contents}</div>
    </div>;
  }

  mountTo(Node) {
    let component = this.render();
    this.root = component.root;
    Object.assign(this.attrs, component.attrs)
    // ...
    Node.appendChild(this.root);
  }
}

export default <TabPanel>
  <span title="tab1">tab1 content</span>
  <span title="tab2">tab2 content</span>
  <span title="tab3">tab3 content</span>
  <span title="tab4">tab4 content</span>
</TabPanel>
