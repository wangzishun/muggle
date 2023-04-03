'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Fragment } from 'react'

import cls from 'classnames'

import { MdxPathTreeNode } from '@/utils/mdxHelper'
import { IconArrow } from '@/components/Icon/IconArrow'

const MenuItem = ({ tree, level, shouldHighlight }) => {
  return tree.map((node) => {
    const { key, value, children } = node

    const { actived, expanded } = shouldHighlight(node)
    const hasChildren = children.length > 0

    return (
      <Fragment key={key}>
        <Link
          href={key}
          className={cls('flex justify-between items-center p-2 rounded-r-xl hover:bg-gray-5 dark:hover:bg-gray-80 ', {
            'font-bold': level === 1,
            'pl-8': level === 1,
            'pl-12': level === 2,
            'pl-16': level === 3,
            'text-link dark:text-link-dark bg-highlight dark:bg-highlight-dark hover:bg-highlight': actived,
            'text-secondary ': !actived,
          })}
        >
          {value}
          {hasChildren && (
            <IconArrow
              className={cls('w-6', {
                'text-link dark:text-link-dark': expanded,
              })}
              displayDirection={expanded ? 'down' : 'right'}
            ></IconArrow>
          )}
        </Link>
        {hasChildren && <MenuItem tree={children} level={level + 1} shouldHighlight={shouldHighlight}></MenuItem>}
      </Fragment>
    )
  })
}

type Props = {
  mdxPathTree: MdxPathTreeNode[]
}
export const LeftSideBar = ({ mdxPathTree }: Props) => {
  const pn = usePathname()
  const pathname = pn.endsWith('/') ? pn : pn + '/'

  const shouldHighlight = (node: MdxPathTreeNode) => {
    return {
      actived: pathname === node.key,
      expanded: pathname.startsWith(`${node.key}/`),
    }
  }

  return (
    <aside className="z-10 hidden lg:block bg-white">
      <nav
        className="sticky top-16 w-80 h-[calc(100vh-4rem)] overflow-y-scroll"
        style={{ overscrollBehavior: 'contain' }}
      >
        <MenuItem tree={mdxPathTree} level={1} shouldHighlight={shouldHighlight}></MenuItem>
        <div className="h-8"></div>
      </nav>
    </aside>
  )
}
