import { parseHTML } from '../../week06/parser';

import assert from 'assert';

it('match tag', () => {
  let doc = parseHTML('<div></  div>text<div/>')
  let div1 = doc.children[0];
  assert.equal(div1.type, 'element');
  assert.equal(div1.tagName, 'div');
  assert.equal(div1.children.length, 0);
  assert.equal(div1.attributes.length, 0);
  let text = doc.children[1];
  assert.equal(text.type, 'text');
  assert.equal(text.content, 'text');
  let div2 = doc.children[2];
  assert.equal(div2.type, 'element');
  assert.equal(div2.tagName, 'div');
  assert.equal(div2.children.length, 0);
  assert.equal(div2.attributes.length, 0);
});

it('match error tag', () => {
  let doc = parseHTML('< div>< /div>text<div/>')
  let text = doc.children[0];
  assert.equal(text.type, 'text');
  assert.equal(text.content, '< div>< /div>text');
  let div = doc.children[1];
  assert.equal(div.type, 'element');
  assert.equal(div.tagName, 'div');
  assert.equal(div.children.length, 0);
  assert.equal(div.attributes.length, 0);
});

it('match attributes', () => {
  let doc = parseHTML('<input  id=\'iid\'  class="cls" value=1 /><div class="cls2" attr ></div>')
  let count = 0;
  let input = doc.children[0];
  for (let attribute of input.attributes) {
    if (attribute.name === 'class' && attribute.value === 'cls')
      count++
    if (attribute.name === 'id' && attribute.value === 'iid')
      count++
    if (attribute.name === 'value' && attribute.value === '1')
      count++
  }
  let div = doc.children[1];
  for (let attribute of div.attributes) {
    if (attribute.name === 'class' && attribute.value === 'cls2')
      count++
    if (attribute.name === 'attr' && attribute.value === '')
      count++
  }
  assert.equal(count, 5);
});

it('match \\t\\n\\f \/\>= in attribute name', () => {
  let doc = parseHTML('<div class/class=>class="cls"class="cls1" />')
  let div = doc.children[0];
  let count = 0;
  for (let attribute of div.attributes) {
    if (attribute.name === 'class' && attribute.value === '')
      count++
  }
  assert.equal(count, 1);
});

it('match \\t\\n\\f \/\>" in attribute value', () => {
  let doc = parseHTML('<div class="cls1 \'cls2 cls>cls cls/cls"/>')
  let div = doc.children[0];
  let count = 0;
  for (let attribute of div.attributes) {
    if (attribute.name === 'class' && attribute.value === 'cls1 \'cls2 cls>cls cls/cls')
      count++
  }
  assert.equal(count, 1);
});

it('match after attribute', () => {
  let doc = parseHTML('<div class="cls1"abc/><div class=\'cls2\'></div><div class=cls3></div><div class=cls4/>')
  let count = 0;
  let div1 = doc.children[0];
  for (let attribute of div1.attributes) {
    if (attribute.name === 'class' && attribute.value === 'cls1')
      count++
  }
  let div2 = doc.children[1];
  for (let attribute of div2.attributes) {
    if (attribute.name === 'class' && attribute.value === 'cls2')
      count++
  }
  let div3 = doc.children[2];
  for (let attribute of div3.attributes) {
    if (attribute.name === 'class' && attribute.value === 'cls3')
      count++
  }
  let div4 = doc.children[3];
  for (let attribute of div4.attributes) {
    if (attribute.name === 'class' && attribute.value === 'cls4')
      count++
  }
  assert.equal(count, 4);
});

it('match style', () => {
  let content = `
    .cls {
      color: red;
    }
  `;
  let doc = parseHTML(`<style>${content}</style>`)
  let style = doc.children[0];
  assert.equal(style.type, 'element');
  assert.equal(style.tagName, 'style');
  assert.equal(style.children[0].content, content);
});
