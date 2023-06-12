'use server'

import matter from 'gray-matter'
import { z } from 'zod'
import { articleURL } from './article'
import { prisma } from './database'
import { generateTOTP } from './totp'

export interface ArticleUploadOptions {
  slug: string
  year: string
  month: string
  day: string
  title: string
  content: string
  tags: string[]
  attachments: AttachmentUploadOptions[]
  totp: string
}

export interface AttachmentUploadOptions {
  name: string
  url?: string
  data?: Blob
}

export async function uploadArticle(options: ArticleUploadOptions) {
  const expectedTotp = await generateTOTP()
  if (expectedTotp !== options.totp) {
    throw new Error('invalid OTP')
  }
  const article = await prisma.article.create({
    data: {
      body: options.content,
      slug: options.slug,
      year: +options.year,
      month: +options.month,
      day: +options.day,
      title: options.title,
      tags: Array.isArray(options.tags) ? options.tags : (options.tags as string).split(' '),
      attachments: {
        create: options.attachments.map((attachment) => ({
          name: attachment.name,
          url: attachment.url,
          data: attachment.data,
        })),
      },
    },
  })

  return articleURL(article)
}

export interface MarkdownUploadOptions {
  markdown: string
  totp: string
}

export async function uploadMarkdown(options: MarkdownUploadOptions) {
  const expectedTotp = await generateTOTP()
  if (expectedTotp !== options.totp) {
    throw new Error('invalid OTP')
  }

  const markdown = matter(options.markdown)

  const FrontmatterSchema = z.object({
    date: z.date(),
    title: z.string(),
    tags: z.string().array().optional(),
    slug: z.string(),
    attachments: z
      .object({
        name: z.string(),
        url: z.string(),
      })
      .array()
      .optional(),
  })

  const frontmatter = FrontmatterSchema.safeParse(markdown.data)
  if (!frontmatter.success) {
    throw new Error('invalid frontmatter: ' + frontmatter.error.message)
  }

  console.log(frontmatter.data.date)

  const article = await prisma.article.create({
    data: {
      body: markdown.content,
      slug: frontmatter.data.slug,
      year: frontmatter.data.date.getUTCFullYear(),
      month: frontmatter.data.date.getUTCMonth() + 1,
      day: frontmatter.data.date.getUTCDate(),
      title: frontmatter.data.title,
      tags: frontmatter.data.tags,
      attachments: {
        create: frontmatter.data.attachments?.map((attachment) => ({
          name: attachment.name,
          url: attachment.url,
        })),
      },
    },
  })

  return articleURL(article)
}
