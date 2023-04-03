import { parseMDXFilePaths, buildMdxPathTree, MDX_DIRECTORY, listMDXCategory } from '@/utils/mdxHelper'

import { LeftSideBar } from '@/components/LeftSideBar'

import { resolve } from 'path'

type Props = {
  params: {
    mdxCategory: string
  }
  children
}

export default async function PostsPageLayout({ params, children }: Props) {
  const mdxFilePaths = await parseMDXFilePaths(resolve(MDX_DIRECTORY, params.mdxCategory))
  const mdxPathTree = buildMdxPathTree(mdxFilePaths, /** prefix */ params.mdxCategory)

  return (
    <div className="flex">
      <LeftSideBar mdxPathTree={mdxPathTree} />
      <div className="flex-1">{children}</div>
    </div>
  )
}

export async function generateStaticParams() {
  const postCategory = await listMDXCategory()

  return postCategory.map((mdxCategory) => ({ mdxCategory }))
}
