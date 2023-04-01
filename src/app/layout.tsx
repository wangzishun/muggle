import './globals.css'

export const metadata = {
  title: 'Muggle',
  description: '麻瓜修仙手册',
}

export default async function RootLayout({ children, ...rest }) {
  return (
    <html lang="zh_CN">
      <body>{children}</body>
    </html>
  )
}
