import { join, resolve } from 'path'
import { promises } from 'fs'

export const POSTS_DIRECTORY = join(process.cwd(), '/posts')

export const listSegments = async (root = POSTS_DIRECTORY) => {
  const stack = [root]

  const segments: string[] = []

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
          } else if (filepath.endsWith('.md')) {
            const segment = filepath
              .slice(rootPathPrefixPos)
              .replace(/\\/g, '/')
              .replace(/(\/index)?\.md/g, '')

            segments.push(segment)
          }
        }),
      )
    })

    await Promise.all(pending)
  }

  return segments.sort().map((segment) => segment.split('/'))
}

export const readFileContent = async (segments) => {
  const mdxFilename = join(POSTS_DIRECTORY, segments.join('/'))

  return promises.readFile(mdxFilename + '.md', 'utf8').catch(() => {
    return promises.readFile(mdxFilename + '/index.md', 'utf8')
  })
}

export const listCategory = async (dir = POSTS_DIRECTORY) => {
  const subdirs = await promises.readdir(dir)

  return subdirs
}
