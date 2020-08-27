const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8081');
  // await page.screenshot({ path: 'out.png' });
  // await page.pdf({path: 'out.pdf', format: 'A4'});
  let result = await page.evaluate(() => {
    let toString = (pad, element) => {
      let nodes = element.childNodes
      let res = '';
      for (let i = 0; i < nodes.length; i++) {
        res += toString(`${pad}  `, nodes[i])
      }
      return `${pad}${element.tagName || element.textContent}${res}`
    }
    return Promise.resolve(toString('', document.body));
  });
  console.log(result);
  await browser.close();
})();