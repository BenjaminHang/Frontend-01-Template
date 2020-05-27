## flex layout

* 主轴：justify-content
* 交叉轴：align-content, align-items, align-self
* 子元素：flex

## css

### @rules
* @charset
* @import
* @media
* @page
* @counter-style
* @keyframes
* @fontface
* @supports
* @namespace

### 筛标准代码
```javascript
var lis = document.getElementById("container").children

var result = [];

for(let li of lis) {
  if(li.getAttribute('data-tag').match(/css/))
    result.push({
      name:li.children[1].innerText,
      url:li.children[1].children[0].href
    });
}
console.log(result);


let iframe = document.createElement('iframe');
document.body.innerHTML = "";
document.body.appendChild(iframe);

function happen (element, event) {
  return new Promise((resolve) => {
    let handler = () => {
      resolve();
      element.removeEventListene(event, handler)
    }
    element.addEventListener(event, handler)
  });
}

void async function () {
  for(let stand of result){
    iframe.src = stand.url;
    await happen(iframe, 'load')
  }
}();
```