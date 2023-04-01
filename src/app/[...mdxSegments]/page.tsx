import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'

import { readFileContent } from '@/utils/posts.server'

import { MDXRemoteComponent } from './MDXRemoteComponent.client'

type Props = {
  params: {
    mdxSegments: string[]
  }
}

export default async function MDXPage({ params }: Props) {
  const mdxContent = await readFileContent(params.mdxSegments)

  const { content, data: scope } = matter(mdxContent)
  const source = await serialize(content)

  return (
    <div className="" style={{ height: 2000 }}>
      <MDXRemoteComponent source={source} scope={scope} />
    </div>
  )
}
