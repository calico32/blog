import { Article, Prisma, PrismaClient } from '@prisma/client'
import { stripIndent } from 'common-tags'
;(async () => {
  const prisma = new PrismaClient()
  await prisma.$connect()

  const [year, month, day] = [2023, 5, 21]
  const slug = 'my-post'

  const id = {
    year,
    month,
    day,
    slug,
  } satisfies Partial<Article>

  const article = {
    title: 'My Post',
    body: stripIndent`
      ![Postman](attachment://postman.png)

      This is my post. There are many like it, but this one is mine.

      My post is my best friend. It is my life. I must master it as I must master my life.

      Without me, my post is useless. Without my post, I am useless. I must fire my post true. I must shoot straighter than my enemy who is trying to kill me. I must shoot him before he shoots me. I will ...

      My post and I know that what counts in war is not the rounds we fire, the noise of our burst, nor the smoke we make. We know that it is the hits that count. We will hit ...

      My post is human, even as I, because it is my life. Thus, I will learn it as a brother. I will learn its weaknesses, its strength, its parts, its accessories, its sights and its barrel. I will keep my post clean and ready, even as I am clean and ready. We will become part of each other. We will ...

      Before God, I swear this creed. My post and I are the defenders of my country. We are the masters of our enemy. We are the saviors of my life.

      So be it, until victory is America's and there is no enemy, but peace!
    `,
    attachments: {
      connectOrCreate: {
        where: {
          articleYear_articleMonth_articleDay_articleSlug_name: {
            articleDay: day,
            articleMonth: month,
            articleSlug: slug,
            articleYear: year,
            name: 'postman.png',
          },
        },
        create: {
          name: 'postman.png',
          url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/William_H._Rupertus.jpg',
        },
      },
    },
  } satisfies Partial<Prisma.ArticleCreateInput>

  console.log(year, month, day)
  await prisma.article.upsert({
    where: {
      year_month_day_slug: id,
    },
    create: {
      ...id,
      ...article,
    },
    update: article,
  })
})()
