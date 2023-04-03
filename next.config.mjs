import nextMdx from '@next/mdx'

const withMdx = nextMdx({
  // By default only the .mdx extension is supported.
  extension: /\.mdx?$/,
  options: {
    /* providerImportSource: …, otherOptions… */
    // providerImportSource: '@mdx-js/react',
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    mdxRs: true,
  },
  // TODO: 无法使用 output: export, 等待bug修复 https://github.com/vercel/next.js/issues/47334
  // output: 'export',
  pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],
  compiler: {
    // removeConsole: false
  }
}

export default withMdx(nextConfig)
