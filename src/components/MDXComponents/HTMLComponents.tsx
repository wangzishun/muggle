import Link from 'next/link'
import { IconLink } from '../Icon/IconLink'
import cls from 'classnames'

export const a = ({ href, className: cn, ref, ...rest }: JSX.IntrinsicElements['a']) => {
  const className = 'text-link border-b border-link border-opacity-0 hover:border-opacity-100 transition'

  if (!href) {
    return <a href={href} className={cls(cn, className)} {...rest}></a>
  }

  const target = href.startsWith('https://') ? '_blank' : '_self'

  if (href.startsWith('#')) {
    return <a href={href} className={cls(cn, className)} target={target} {...rest}></a>
  }

  return <Link href={href} className={cls(cn, className)} target={target} {...rest}></Link>
}

export const blockquote = ({ children, ...props }: JSX.IntrinsicElements['blockquote']) => (
  <blockquote className="px-4 py-2 my-4 bg-highlight bg-opacity-50 rounded-xl leading-2 shadow-sm" {...props}>
    {children}
  </blockquote>
)

type HeadingProps = {
  id: string
  children: React.ReactNode

  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
  className
}

const Heading = ({ id, children, as: Comp = 'div', className }: HeadingProps) => {
  return (
    <Comp id={id} className={className}>
      {children}
      <a href={`#${id}`} className="inline-block text-secondary hover:text-link ml-2">
        <IconLink size={14}></IconLink>
      </a>
    </Comp>
  )
}

export const h1 = (props) => {
  return <Heading as="h1" className="scroll-mt-24 text-5xl font-bold" {...props}></Heading>
}

export const h2 = (props) => {
  return <Heading as="h2" className="scroll-mt-24 text-3xl my-6 font-bold" {...props}></Heading>
}

export const h3 = (props) => {
  return <Heading as="h3" className="scroll-mt-24 text-2xl my-6 font-bold" {...props}></Heading>
}

export const h4 = (props) => {
  return <Heading as="h4" className="scroll-mt-24 text-1xl my-5 font-bold" {...props}></Heading>
}

export const hr = () => <hr className="my-6 block border-b border-t-0 border-border dark:border-border-dark" />

export const li = (p: JSX.IntrinsicElements['li']) => <li className="leading-relaxed mb-1" {...p} />

export const ol = (p: JSX.IntrinsicElements['ol']) => <ol className="ml-6 my-3 list-decimal" {...p} />

export const p = (p: JSX.IntrinsicElements['p']) => <p className="whitespace-pre-wrap my-3" {...p}></p>

export const strong = (p: JSX.IntrinsicElements['strong']) => <strong className="font-bold" {...p} />

export const ul = (p: JSX.IntrinsicElements['ul']) => <ul className="ml-6 my-3 list-disc" {...p} />
