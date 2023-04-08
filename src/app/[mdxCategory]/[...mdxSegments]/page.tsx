import { resolve } from 'path'

import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'

import { parseMDXFilePaths, readMDXFileContent, MDX_DIRECTORY } from '@/utils/mdxHelper'
import { rehypeExtractHeadings } from '@/utils/rehypePlugins'

import { TableOfContentAnchors } from '@/components/TableOfContentAnchors'
import { MDXRemoteComponent } from '@/components/MDXComponents'

type Props = {
  params: {
    mdxCategory: string
    mdxSegments: string[]
  }
}

export default async function MdxSegmentsPage({ params }: Props) {
  const mdxContent = await readMDXFileContent(resolve(MDX_DIRECTORY, params.mdxCategory, ...params.mdxSegments))

  const { content, data } = matter(mdxContent)

  const headings = []
  const source = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [[rehypeExtractHeadings, { headings }]],
    },
  })

  return (
    <div className="flex justify-between">
      <article className="px-12 flex-1">
        <MDXRemoteComponent source={source} scope={data} />
        <div className="h-96"></div>
      </article>
      <TableOfContentAnchors headings={headings}></TableOfContentAnchors>
    </div>
  )
}

export async function generateStaticParams({ params }) {
  const mdxFilePaths = await parseMDXFilePaths(resolve(MDX_DIRECTORY, params.mdxCategory))
  return mdxFilePaths.map((p) => p.split('/')).map((mdxSegments) => ({ mdxSegments }))
}
