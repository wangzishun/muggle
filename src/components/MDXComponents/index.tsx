'use client'

import { MDXRemote } from 'next-mdx-remote'

import * as HTMLComponents from './HTMLComponents'

import { Sandpack } from './Sandpack'

export const MDXRemoteComponent = ({ source, scope }) => {
  return <MDXRemote {...source} components={{ ...HTMLComponents, Sandpack }} />
}
