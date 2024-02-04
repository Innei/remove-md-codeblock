// @ts-nocheck
import markdown from 'remark-parse'
import stringify from 'remark-stringify'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

// 自定义插件来删除代码块
function removeCodeBlocks() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      parent.children.splice(index, 1)
    })
  }
}

export default (mdContent) => {
  // 读取 Markdown 文件

  // 使用 remark 处理 Markdown
  return new Promise((resolve) => {
    unified()
      .use(markdown)
      .use(removeCodeBlocks)
      .use(stringify)
      .process(mdContent, (err, file) => {
        if (err) throw err
        // 保存处理后的内容

        return resolve(String(file))
      })
  })
}
