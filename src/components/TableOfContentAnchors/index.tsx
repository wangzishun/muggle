'use client'

import cls from 'classnames'
import { useState, useEffect, useMemo, useRef } from 'react'

import { useThrottleFn, useEventListener } from 'ahooks'

type Props = {
  headings: { title: string; id: string }[]
}

export const TableOfContentAnchors = ({ headings }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const ref = useRef<HTMLElement>(null)

  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       const id = entry.target.id

  //       const a = ref.current?.querySelector(`a[href="#${id}"]`)
  //       if (!a) {
  //         return
  //       }
  //       if (entry.intersectionRatio > 0) {
  //         a.classList.add('bg-highlight', 'dark:bg-highlight-dark', 'text-link', 'dark:text-link-dark')
  //       } else {
  //         a.classList.remove('bg-highlight', 'dark:bg-highlight-dark', 'text-link', 'dark:text-link-dark')
  //       }
  //     })
  //   })

  //   headings
  //     .map((heading) => document.querySelector(`#${heading.id}`)!)
  //     .filter(Boolean)
  //     .map((el) => observer.observe(el))

  //   return observer.disconnect
  // }, [])

  return (
    <aside className="TableOfContentAnchors hidden xl:block w-80">
      <nav
        ref={ref}
        className="w-80 h-screen fixed top-0 right-0 pt-24 overflow-y-auto space-y-2 text-sm bg-white z-10"
      >
        {headings?.map((heading, index) => {
          return (
            <a
              href={`#${heading.id}`}
              key={heading.id}
              className={cls('rounded-l-xl p-2 block hover:text-link hover:dark:text-link-dark', {})}
            >
              {heading.title}
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
