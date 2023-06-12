'use client'

import { ArticleUploadOptions, uploadArticle, uploadMarkdown } from '@/lib/upload'
import clsx from 'clsx'
import { ArrowLeft, Loader } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MultiAttachmentUpload from './MultiAttachmentUpload'
import OTPTimer from './OTPTimer'

type UploadFormValues = {
  markdown: FileList
  totp: string
}
type TypedFormValues = ArticleUploadOptions

export default function Page(): JSX.Element {
  const upload = useForm<UploadFormValues>({
    mode: 'onTouched',
  })
  useWatch({ control: upload.control, name: 'markdown' })

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    control,
  } = useForm<TypedFormValues>({
    mode: 'onTouched',
    defaultValues: {
      tags: [],
      attachments: [],
    },
  })
  const [previewEnabled, setPreviewEnabled] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const tryUploadMarkdown = async (values: UploadFormValues) => {
    setUploadError('')
    setUploadSuccess('')
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(values)
      const result = await uploadMarkdown({
        totp: values.totp,
        markdown: await values.markdown[0].text(),
      })
      setUploadSuccess(`uploaded successfully to ${result}`)
    } catch (err) {
      console.error(err)
      setUploadError((err as any).message)
    }
  }

  const tryUploadArticle = async (values: TypedFormValues) => {
    setError('')
    setSuccess('')
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const result = await uploadArticle(values)
      setSuccess(`uploaded successfully to ${result}`)
    } catch (err) {
      console.error(err)
      setError((err as any).message)
    }
  }

  return (
    <div className="mb-16 text-black">
      <Link className="mb-4 flex w-min items-center gap-1 px-px hover:underline" href="/">
        <ArrowLeft size={18} strokeWidth={1.5} />
        home
      </Link>
      <h1 className="prose mx-auto mb-8 text-6xl font-medium">Article Uploader</h1>
      <hr className="my-4 h-2 border-t-2 border-black" />

      <form className="flex items-stretch gap-6" onSubmit={upload.handleSubmit(tryUploadMarkdown)}>
        <section className="flex flex-col">
          <label className="flex gap-2 text-xl font-bold">Markdown</label>
          <input accept=".md" className="h-full" type="file" {...upload.register('markdown', { required: true })} />
        </section>

        <div className="flex-grow" />

        <section className="flex flex-col">
          <label className="flex gap-2 text-xl font-bold">
            OTP
            <OTPTimer />
          </label>
          <input
            type="password"
            placeholder="otp"
            autoComplete="one-time-code"
            {...upload.register('totp', { required: true })}
            className={clsx(
              upload.formState.errors.totp ? 'border-red-500' : 'border-gray-500',
              'w-32 rounded-md border px-2 py-1 shadow-inner'
            )}
          />
        </section>

        <button
          type="submit"
          disabled={upload.formState.isSubmitting}
          className={clsx(
            upload.formState.isSubmitting ? 'cursor-not-allowed bg-gray-300' : 'bg-sky-600 text-white hover:bg-sky-700',
            'h-[61.79px] w-max rounded-md border px-7 py-3 text-xl font-medium shadow-inner'
          )}
        >
          {upload.formState.isSubmitting ? <Loader className="animate-spin" /> : 'Upload'}
        </button>
      </form>

      {uploadError && (
        <div className="flex justify-end">
          <span className="text-red-500">{uploadError}</span>
        </div>
      )}
      {uploadSuccess && (
        <div className="flex justify-end">
          <span className="text-green-500">{uploadSuccess}</span>
        </div>
      )}

      <hr className="mb-4 mt-8 h-2 border-t-2 border-gray-300" />

      <form onSubmit={handleSubmit(tryUploadArticle)} className="flex flex-col gap-6">
        <section className="flex flex-col">
          <label className="text-xl font-bold">Title</label>
          <input
            type="text"
            placeholder="title"
            {...register('title', { required: true })}
            className={clsx(
              errors.year ? 'border-red-500' : 'border-gray-500',
              'w-full rounded-md border px-2 py-1 shadow-inner'
            )}
          />
        </section>
        <section className="flex flex-col">
          <label className="text-xl font-bold">URL</label>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-light">/</span>
            <input
              type="text"
              placeholder="year"
              {...register('year', { required: true, validate: (v) => !isNaN(+v) && +v > 0 })}
              className={clsx(
                errors.year ? 'border-red-500' : 'border-gray-500',
                'w-20 rounded-md border px-2 py-1 shadow-inner'
              )}
            />
            <span className="text-2xl font-light">/</span>
            <input
              type="text"
              placeholder="month"
              {...register('month', { required: true, validate: (v) => !isNaN(+v) && +v >= 1 && +v <= 12 })}
              className={clsx(
                errors.month ? 'border-red-500' : 'border-gray-500',
                'w-20 rounded-md border px-2 py-1 shadow-inner'
              )}
            />
            <span className="text-2xl font-light">/</span>
            <input
              type="text"
              placeholder="day"
              {...register('day', { required: true, validate: (v) => !isNaN(+v) && +v >= 1 && +v <= 31 })}
              className={clsx(
                errors.day ? 'border-red-500' : 'border-gray-500',
                'w-20 rounded-md border px-2 py-1 shadow-inner'
              )}
            />
            <span className="text-2xl font-light">/</span>
            <input
              type="text"
              placeholder="slug"
              {...register('slug', {
                required: true,
                pattern: /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
              })}
              className={clsx(
                errors.slug ? 'border-red-500' : 'border-gray-500',
                'w-full rounded-md border px-2 py-1 shadow-inner'
              )}
            />
          </div>
        </section>
        <section className="flex flex-col">
          <div className="flex gap-2">
            <label className="text-xl font-bold">Content</label>
            <button type="button" className="text-sky-600" onClick={() => setPreviewEnabled((v) => !v)}>
              {previewEnabled ? 'disable' : 'enable'} preview
            </button>
          </div>
          {previewEnabled ? (
            <div className="h-64 overflow-y-scroll rounded-md border border-gray-500 p-2 shadow-inner">
              <ReactMarkdown
                className="prose text-lg"
                remarkPlugins={[remarkGfm]}
                components={{
                  img: (props) => <span>[image: {props.src}]</span>,
                }}
              >
                {getValues('content')}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              placeholder="content..."
              {...register('content', { required: true })}
              className={clsx(
                errors.content ? 'border-red-500' : 'border-gray-500',
                'w-full rounded-md border px-2 py-1 font-mono shadow-inner'
              )}
            />
          )}
        </section>
        <section className="flex flex-col">
          <label className="text-xl font-bold">Tags</label>
          <input
            type="text"
            placeholder="space separated tags"
            {...register('tags', {
              setValueAs(value) {
                if (Array.isArray(value)) {
                  return value
                }
                return [...new Set<string>(value?.split(' ').filter(Boolean))]
              },
            })}
            className={clsx(
              errors.tags ? 'border-red-500' : 'border-gray-500',
              'w-full rounded-md border px-2 py-1 shadow-inner'
            )}
          />
        </section>
        <section className="flex flex-col">
          <label className="text-xl font-bold">Attachments</label>
          <MultiAttachmentUpload getValues={getValues} setValue={setValue} register={register} control={control} />
          {/* <MultiFileUpload
            files={attachments}
            onChange={(files) => setValue('attachments', files)}
            // accept="image/*"
            // primaryText="primary image"
            // validate={(f) => {
            // if (!f.type.startsWith('image/')) {
            //   return (
            //     <>
            //       <strong>{f.name}</strong> doesnt&apos;t look like an image, so it was not added.
            //     </>
            //   )
            // }
            // }}
          /> */}
        </section>

        <div className="flex justify-end gap-6">
          <section className="flex flex-col">
            <label className="flex gap-2 text-xl font-bold">
              OTP
              <OTPTimer />
            </label>
            <input
              type="password"
              placeholder="otp"
              autoComplete="one-time-code"
              {...register('totp', { required: true })}
              className={clsx(
                errors.totp ? 'border-red-500' : 'border-gray-500',
                'w-32 rounded-md border px-2 py-1 shadow-inner'
              )}
            />
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            className={clsx(
              isSubmitting ? 'cursor-not-allowed bg-gray-300' : 'bg-sky-600 text-white hover:bg-sky-700',
              'w-max rounded-md border px-7 py-3 text-xl font-medium  shadow-inner'
            )}
          >
            {isSubmitting ? <Loader className="animate-spin" /> : 'Upload'}
          </button>
        </div>
        {error && (
          <div className="flex justify-end">
            <span className="text-red-500">{error}</span>
          </div>
        )}
        {success && (
          <div className="flex justify-end">
            <span className="text-green-500">{success}</span>
          </div>
        )}
      </form>
    </div>
  )
}
