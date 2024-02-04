# Excalidraw 数据增量存储的构想

这几天，我给 [Shiro](https://github.com/Innei/Shiro) 的 Markdown 支持加上了 Excalidraw 的画板。

https://innei.in/posts/programming/modular-request-data-management-concept

上面的文章中，内嵌了大量用 Excalidraw 作的图。在 Markdown 中内嵌这种画板其实只要在渲染时候根据数据决定渲染组件就行了。Excalidraw 的数据格式是一个 JSON 数据，我原本的构想是直接利用 Markdown 的代码块格式，language 指定为 excalidraw，然后只要在渲染时候去判断就行了。

这样的做法是非常简单的。例如在 Markdown 中插入如下的内容。


```js
const a = 1
```

algoliaSearch

```html
const a = 1
```

algoliaSearch

```excalidraw
const a = 1
```

```excalidraw2222
const a = 1
```


aa

````markdown
```excalidraw
{"type":"excalidraw","version":2,"source":"http://localhost:2323","elements":[{"id":"XoWT6cmhHOi8z5zAAX4jf","type":"rectangle","x":-222.2812271118164,"y":-161.63150024414062,"width":355.21875,"height":239.31640625,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":{"type":3},"seed":1343987013,"version":38,"versionNonce":982834725,"isDeleted":false,"boundElements":null,"updated":1706977127668,"link":null,"locked":false}],"appState":{"gridSize":null,"viewBackgroundColor":"#ffffff"}}
```
````

就会渲染这样的结果。

![](https://object.innei.in/bed/2024/0204_1706977641250.png)

这很好。但是随着图的复杂，数据量非常庞大，内嵌在 Markdown 中属实不妥，而且更重要的是，当文档的字符数超过一定的范围之后，algoliaSearch 会被拒绝收录，比如下面作图。

![](https://object.innei.in/bed/2024/0204_1706977805711.png)

经过压缩的 JSON 数据都来到了 32K。

![](https://object.innei.in/bed/2024/0204_1706978001208.png)

如果一个文档中多包涵几个这样作图，整个文档的大小都快到好几百 K 了。而且内嵌的数据也是难以阅读。

我提出一个新的存储方案。

在 Markdown 中除了解析原有的数据结构之外以保证兼容性，另外引入引用的数据存储方式。例如下面的格式。

````markdown
```excalidraw
https://gist.githubusercontent.com/Innei/0e60d7ba7672147cc7b7c24480400428/raw/547522201e71189eed08bbd763eea65224872ce9/test.excalidraw
{"source":["https://excalidraw.com","http://localhost:2323"],"elements":{"0":{"boundElements":[null,[]]},"1":[{"type":"ellipse","version":11,"versionNonce":479831339,"isDeleted":false,"id":"euMxBYc3ouFIFs49-MrKV","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"angle":0,"x":290.70906829833984,"y":302.01168060302734,"strokeColor":"#1e1e1e","backgroundColor":"#ffec99","width":187,"height":235.40234375,"seed":1548041963,"groupIds":[],"frameId":null,"roundness":{"type":2},"boundElements":[],"updated":1706959069124,"link":null,"locked":false}],"2":[{"type":"rectangle","version":15,"versionNonce":1344649355,"isDeleted":false,"id":"qgVmshWC3FRwZzp1ROv4K","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"angle":0,"x":563.6192245483398,"y":286.01168060302734,"strokeColor":"#1e1e1e","backgroundColor":"#ffec99","width":346.0078125,"height":315.234375,"seed":1478608843,"groupIds":[],"frameId":null,"roundness":{"type":3},"boundElements":[],"updated":1706959070487,"link":null,"locked":false}],"3":[{"type":"arrow","version":10,"versionNonce":806397620,"isDeleted":false,"id":"_gL2MH5dBkS4qa5i7ZOk6","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"angle":0,"x":338.1563186645508,"y":262.195556640625,"strokeColor":"#1e1e1e","backgroundColor":"transparent","width":430.1640625,"height":35.09375,"seed":59309068,"groupIds":[],"frameId":null,"roundness":{"type":2},"boundElements":[],"updated":1706959508640,"link":null,"locked":false,"startBinding":null,"endBinding":null,"lastCommittedPoint":null,"startArrowhead":null,"endArrowhead":"arrow","points":[[0,0],[430.1640625,35.09375]]}],"_t":"a"},"files":[{},0,0]}
```
````

第一行为引用地址，这个存储的是最原始的作图数据，第二行位压缩的 JSON 数据，记录在原始数据集上增量的 Diff，在解析时，首先获取原始数据，然后用 patch 的方式获取修改之后的数据集。

当然如果没有增量数据时，就变成下面的形式：

````markdown
```excalidraw
https://gist.githubusercontent.com/Innei/0e60d7ba7672147cc7b7c24480400428/raw/547522201e71189eed08bbd763eea65224872ce9/test.excalidraw
```
````

这样的增量存储的方式，还可以复用原先的作图，在此基础上做增量修改。比如我做了下面的编辑功能。

<video src="https://object.innei.in/bed/2024/0204_1706980574019.mov" />

在第一个作图的基础上增量绘制的新作图。

最后生成的 Markdown 内容是：

````markdown
```excalidraw
ref:file/koi3m8unhivw47rwan.excalidraw
```

```excalidraw
ref:file/koi3m8unhivw47rwan.excalidraw
{"elements":{"0":{"boundElements":[null,[]]},"1":[{"id":"mBu018nlCDYkLyN6lCxwn","type":"ellipse","x":-352.3143539428711,"y":-186.44375610351562,"width":283.37890625,"height":264.01171875,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":[],"frameId":null,"roundness":{"type":2},"seed":851926698,"version":13,"versionNonce":1222766506,"isDeleted":false,"boundElements":null,"updated":1706980523583,"link":null,"locked":false}],"_t":"a"}}
```

````

**上面第一行的 ref:<path> 是我做的 alias 和地址无区别**

完整的代码实现可供参考：

https://github.com/Innei/sprightly/blob/12351b900790fbf036699114d3cbc377600127a0/src/components/ui/editor/Milkdown/plugins/Excalidraw.tsx

https://github.com/Innei/sprightly/blob/bec612d740c7b82e59de450aa078b57ba048f5fd/src/components/ui/excalidraw/Excalidraw.tsx