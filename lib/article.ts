import { Article } from '@prisma/client'

export type ArticleInfo = Pick<Article, 'year' | 'month' | 'day' | 'slug'>

export function articleURL(article: ArticleInfo) {
  const { year, month, day, slug } = article
  return `/${year}/${month}/${day}/${slug}`
}
