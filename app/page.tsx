import { prisma } from '@/lib/database'
import { ArrowUpLeft } from 'lucide-react'
import { Metadata } from 'next'
import { Fragment } from 'react'
import ArticleLink from './ArticleLink'

export const metadata: Metadata = {
  title: "calico's blog",
  description: "calico's blog for tech and irl and everything in between",
}

export default async function Page() {
  const articles = await prisma.article.findMany()
  return (
    <div className="text-black">
      <div>
        <a className="mb-4 flex w-min items-center border-black px-px hover:underline" href="https://calico.lol">
          <ArrowUpLeft size={18} strokeWidth={1.5} />
          calico.lol
        </a>
      </div>
      <h1 className="prose mx-auto mb-8 text-6xl font-medium">calico's blog</h1>
      <hr className="my-4 h-2 border-t-2 border-black" />
      {articles.map((article, i) => (
        <Fragment key={i}>
          <ArticleLink article={article} />
          <hr className="my-4 h-2 border-t-2 border-black" />
        </Fragment>
      ))}
    </div>
  )
}
