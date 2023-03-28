import { join, resolve } from 'path'
import { promises } from 'fs'

export const POSTS_PATH = join(process.cwd(), '/posts')

export const getPostsFilenames = async (dir = POSTS_PATH) => {
  const subdirs = await promises.readdir(dir)
  const files = await Promise.all(
    subdirs.map(async (sub) => {
      const res = resolve(dir, sub)
      const stat = await promises.stat(res)
      return stat.isDirectory() ? getPostsFilenames(res) : res.slice(POSTS_PATH.length + 1)
    }),
  )

  return files.flat().filter((filename) => filename.endsWith('.md'))
}
