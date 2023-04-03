import { join, resolve } from 'path'
import { promises } from 'fs'

/**
 * mdx file directory
 */
export const MDX_DIRECTORY = join(process.cwd(), '/posts')

/**
 * parse mdx file paths from "root" directory
 * @param root
 * @returns
 */
export const parseMDXFilePaths = async (root) => {
  const stack = [root]

  const paths: string[] = []

  const rootPathPrefixPos = root.length + 1

  while (stack.length) {
    const list = stack.slice()
    stack.length = 0

    const pending = list.map(async (current) => {
      const subdirs = await promises.readdir(current)

      await Promise.all(
        subdirs.map(async (sub) => {
          const filepath = resolve(current, sub)
          const stat = await promises.stat(filepath)

          if (stat.isDirectory()) {
            stack.push(filepath)
            return
          }

          if (filepath.endsWith('.md')) {
            paths.push(
              filepath
                .slice(rootPathPrefixPos)
                .replace(/\\/g, '/')
                .replace(/(\/index)?\.md/g, ''),
            )
          }
        }),
      )
    })

    await Promise.all(pending)
  }

  return paths.sort()
}

export type MdxPathTreeNode = { key: string; value: string; children: MdxPathTreeNode[] }

/**
 * transform post file paths to tree structure
 *
 * @param paths string[]
 * @returns {MdxPathTreeNode[]}
 */
export const buildMdxPathTree = (paths: string[], prefix: string) => {
  const tree: MdxPathTreeNode[] = []

  const map: Record<string, MdxPathTreeNode> = {}

  for (const p of paths) {
    const pathStack: string[] = ['', prefix]
    let current = tree

    const parts = p.split('/')

    for (const value of parts) {
      pathStack.push(value)

      const key = pathStack.join('/')

      let node = map[key]

      if (!node) {
        node = map[key] = { key, value, children: [] }
        current.push(node)
      }

      current = node.children
    }
  }

  return tree
}

/**
 *
 * @param mdxFilePath
 * @returns
 */
export const readMDXFileContent = async (mdxFilePath: string) => {
  return promises.readFile(mdxFilePath + '.md', 'utf8').catch(() => {
    return promises.readFile(mdxFilePath + '/index.md', 'utf8')
  })
}

/**
 *
 * @param dir
 * @returns
 */
export const listMDXCategory = async (dir = MDX_DIRECTORY) => {
  const subdirs = await promises.readdir(dir)

  return subdirs
}
