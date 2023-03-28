import { getPostsFilenames } from '@/utils/posts.server'

type Props = {
  params: {
    segments: string[]
  }
}

export default function MDXPage({ params }: Props) {
  // const [count, setCount] = useState(0)
  console.log(params)

  return (
    <main>
      {'slug'}
      <button>1111</button>
    </main>
  )
}

// export const getServerSideProps = async ({ params }) => {}

export async function generateStaticParams() {
  const filenames = await getPostsFilenames()

  return filenames.map((name) => ({
    segments: name.slice(0, -3).replace(/\\/g, '/').split('/'),
  }))
}
