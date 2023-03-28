import './globals.css'

export const metadata = {
  title: 'Muggle',
  description: '麻瓜修仙手册',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh_CN">
      <body>{children}</body>
    </html>
  )
}
