'use client'

import cls from 'classnames'
import { useState, useEffect, useMemo } from 'react'

import { useThrottleFn, useEventListener } from 'ahooks'

type Props = {
  headings: { title: string; id: string }[]
}

export const TableOfContentAnchors = ({ headings }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const { run: updateActiveLink } = useThrottleFn(
    () => {
      const pageHeight = document.body.scrollHeight
      const scrollPosition = window.scrollY + window.innerHeight

      const headingsLastIndex = headings.length - 1

      if (scrollPosition >= pageHeight) {
        return setCurrentIndex(headingsLastIndex)
      }

      for (let i = 0; i <= headingsLastIndex; i++) {
        const h = document.getElementById(headings[i].id)
        if (!h) continue

        const { top } = h.getBoundingClientRect()

        if (top > 60) {
          return setCurrentIndex(Math.max(i - 1, 0))
        }
      }
    },
    { wait: 100 },
  )

  useEventListener('scroll', updateActiveLink)
  useEventListener('resize', updateActiveLink)

  return (
    <nav className="w-full h-full overflow-y-auto hidden lg:max-w-xs xl:block sticky top-16 right-0 space-y-2 text-sm">
      {headings?.map((heading, index) => {
        return (
          <a
            href={`#${heading.id}`}
            key={heading.id}
            className={cls('rounded-l-xl p-2 block hover:text-link hover:dark:text-link-dark', {
              'bg-highlight dark:bg-highlight-dark text-link dark:text-link-dark': currentIndex === index,
            })}
          >
            {heading.title}
          </a>
        )
      })}
    </nav>
  )
}
