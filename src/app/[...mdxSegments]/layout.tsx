import { TopNavigationBar } from '@/components/TopNavigationBar'
import { listCategory, listSegments } from '@/utils/posts.server'

export default async function MDXPageLayout({ children }) {
  const postCategory = await listCategory()

  return (
    <main>
      <TopNavigationBar list={postCategory}></TopNavigationBar>
      {children}
    </main>
  )
}

export async function generateStaticParams() {
  return listSegments()
}
