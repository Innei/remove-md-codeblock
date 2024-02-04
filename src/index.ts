import markdown from 'remark-parse'
import stringify from 'remark-stringify'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

// 自定义插件来删除代码块
function removeCodeBlocks() {
  return (tree: any) => {
    visit(tree, 'code', (node, index, parent) => {
      // 确保 index 有定义
      if (typeof index === 'number' && parent) {
        // 移除该节点
        parent.children.splice(index, 1)
        // 由于节点被移除，需要调整索引
        return index - 1
      }
    })
  }
}

export default (mdContent: string) => {
  // 读取 Markdown 文件

  // 使用 remark 处理 Markdown
  return unified()
    .use(markdown)
    .use(removeCodeBlocks)
    .use(stringify)
    .processSync(mdContent)
    .toString()
}
