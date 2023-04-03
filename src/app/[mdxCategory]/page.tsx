import { resolve } from 'path'
import { redirect } from 'next/navigation'

import { parseMDXFilePaths, MDX_DIRECTORY } from '@/utils/mdxHelper'

type Props = {
  params: {
    mdxCategory: string
  }
}

export default async function PostsPage({ params }: Props) {
  /**
   * redirect to the first mdx file in current category
   */
  const [first] = await parseMDXFilePaths(resolve(MDX_DIRECTORY, params.mdxCategory))
  return redirect(['', params.mdxCategory, first].join('/'))
}
