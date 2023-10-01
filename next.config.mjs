// import nextMdx from '@next/mdx'

// const withMdx = nextMdx({
//   // By default only the .mdx extension is supported.
//   extension: /\.mdx?$/,
//   options: {
//     /* providerImportSource: …, otherOptions… */
//     // providerImportSource: '@mdx-js/react',
//   },
// })

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  output: 'export',
  pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],
  compiler: {
    // removeConsole: false
  },
}

export default nextConfig
