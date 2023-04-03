import { TopNavigationBar } from '@/components/TopNavigationBar'
import './globals.css'
import { listMDXCategory } from '@/utils/mdxHelper'

export const metadata = {
  title: 'Muggle Handbook',
  description: '',
}

export default async function RootLayout({ children, ...rest }) {
  const postCategory = await listMDXCategory()

  return (
    <html lang="zh_CN">
      <body>
        <TopNavigationBar list={postCategory}></TopNavigationBar>
        <main>{children}</main>
      </body>
    </html>
  )
}
