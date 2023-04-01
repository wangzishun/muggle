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
  output: 'export',
  // basePath: '/muggle',
  pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],
}

export default withMdx(nextConfig)
