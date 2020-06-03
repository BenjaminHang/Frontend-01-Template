### 优先级

1. 请写出下面选择器的优先级
* div#a.b .c[id=x]

  [0, 1, 3, 1]

* #a:not(#b)

  [0, 2, 0, 0]

* *.a

  [0, 0, 1, 0]

* div.a

  [0, 0, 1, 1]

### 思考
1. 为什么 first-letter 可以设置 display:block 之类的，而 first-line 不行呢？

    first-line设置了float会导致脱离文档流而使得下一行变成first-line，从而导致无限循环。

2. 我们如何写字？

    一行写满，换行，每行都会对齐。

### 作业
3. 编写一个 match 函数，完善你的 toy-browser

    见第六周作业。

