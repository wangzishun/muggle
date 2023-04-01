'use client'

import Image from 'next/image'
import Link from 'next/link'
import cls from 'classnames'

import { useParams, useRouter, useSelectedLayoutSegment, usePathname } from 'next/navigation'
import { useIntersection } from 'react-use'
import { useRef } from 'react'

type Props = {
  list
}

export const TopNavigationBar = ({ list }: Props) => {
  const actived = usePathname().split('/')[1]

  const isActived = (url) => actived === url

  const scrollDetectorRef = useRef(null)
  const intersection = useIntersection(scrollDetectorRef, {
    root: null,
    rootMargin: `0px 0px`,
    threshold: 0,
  })
  const isScrolling = intersection?.isIntersecting === false

  return (
    <div className="h-16 w-full flex items-center justify-between">
      <div ref={scrollDetectorRef}></div>
      <nav className="px-2 items-center gap-1.5 hidden lg:flex">
        {list.map((url) => {
          return (
            <Link
              href={url}
              key={url}
              className={cls('px-2 py-2 rounded-md active:scale-95 transition-transform', {
                'hover:bg-primary/5 hover:dark:bg-primary-dark/5': !isActived(url),
                'bg-highlight dark:bg-highlight-dark text-link dark:text-link-dark': isActived(url),
              })}
            >
              {url}
            </Link>
          )
        })}
        <Link
          href="https://github.com/wangzishun/muggle"
          target="_blank"
          className="px-2 py-2 rounded-md active:scale-95 transition-transform hover:bg-primary/5 hover:dark:bg-primary-dark/5"
        >
          <Image src="/icon/github.svg" alt="github" width={24} height={24}></Image>
        </Link>
      </nav>
    </div>
  )
}
