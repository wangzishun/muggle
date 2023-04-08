'use client'

import { Children, FC, ReactElement, PropsWithChildren } from 'react'
import type { SandpackFile } from '@codesandbox/sandpack-react'

export const Sandpack = ({ children }: PropsWithChildren) => {
  const codeSnippets = Children.toArray(children).reduce((acc, snippet) => {
    if (typeof snippet !== 'object') {
      return acc
    }

    console.log(snippet)

    return acc
  }, {} as Record<string, SandpackFile>)

  return <div>{children}</div>
}
