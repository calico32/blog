import { articleURL } from '@/lib/article'
import styles from '@/styles/ArticleLink.module.css'
import { Article } from '@prisma/client'
import clsx from 'clsx'
import Link from 'next/link'

interface ArticleLinkProps {
  article: Article
}

const ArticleLink = ({ article }: ArticleLinkProps): JSX.Element => {
  const { year, month, day, title } = article
  return (
    <Link className={clsx(`mb-7 flex flex-col gap-2`, styles.link)} href={articleURL(article)}>
      <div className="text-xl font-medium text-sky-600">
        {year}.{month}.{day}
      </div>

      <h1 className="text-5xl font-semibold">{title}</h1>
    </Link>
  )
}

export default ArticleLink
