'use client'

import { MDXRemote } from 'next-mdx-remote'

import * as HTMLComponents from './HTMLComponents'

import { Sandpack } from './Sandpack'

export const MDXRemoteComponent = ({ source, scope }) => {
  return (
    <article className="px-12 flex-1 min-w-0">
      <MDXRemote {...source} components={{ ...HTMLComponents, Sandpack }} />
      <div className="h-96"></div>
    </article>
  )
}
