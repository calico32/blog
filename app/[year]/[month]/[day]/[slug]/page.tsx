import { prisma } from '@/lib/database'
import { ArrowLeft } from 'lucide-react'
import { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import remarkGfm from 'remark-gfm'

type PostQuery = {
  year: number | string
  month: number | string
  day: number | string
  slug: string
}

type PageParams = {
  year: string
  month: string
  day: string
  slug: string
}

const getPost = cache(async (params: PostQuery) => {
  const article = await prisma.article.findUnique({
    where: {
      year_month_day_slug: {
        year: Number(params.year),
        month: Number(params.month),
        day: Number(params.day),
        slug: params.slug,
      },
    },
    include: { attachments: true },
  })

  return article
})

export async function generateMetadata(
  { params }: { params: PageParams },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPost(params)
  if (!post) {
    throw new Error('Post not found')
  }

  let description = post.body.slice(0, 100)
  if (post.body.length > 100) {
    description += '…'
  }

  if (post.tags.length > 0) {
    description += '\nin ' + post.tags.map((t) => `#${t}`).join(' ')
  }

  return {
    title: `${post.year}.${post.month}.${post.day} - ${post.title}`,
    description,
    openGraph: {
      type: 'article',
    },
  }
}

export default async function Page({ params }: { params: PageParams }) {
  const article = await getPost(params)
  if (!article) {
    notFound()
  }

  const { title, body, year, month, day } = article

  return (
    <div>
      <Link className="mb-4 flex w-min items-center gap-1 px-px hover:underline" href="/">
        <ArrowLeft size={18} strokeWidth={1.5} />
        home
      </Link>
      <div className="mb-3 mt-8 text-3xl font-medium text-sky-600">
        {year}.{month}.{day}
      </div>

      <h1 className="mb-8 text-6xl font-bold">{title}</h1>
      <ReactMarkdown
        className="prose mb-32 text-lg"
        remarkPlugins={[remarkGfm]}
        transformImageUri={(uri) => {
          if (uri.startsWith('attachment://')) {
            const name = uri.slice(13)
            const attachment = article.attachments.find((a) => a.name === name)
            if (!attachment) return '/attachment-not-found.png'
            return attachment.url!
          }
          return uri
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}
