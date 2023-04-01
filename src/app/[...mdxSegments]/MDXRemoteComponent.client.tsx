'use client'

import { MDXRemote } from 'next-mdx-remote'

export const MDXRemoteComponent = ({ source, scope }) => {
  return <MDXRemote {...source} />
}
