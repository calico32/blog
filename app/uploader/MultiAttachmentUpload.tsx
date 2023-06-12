import { ArticleUploadOptions } from '@/lib/upload'
import clsx from 'clsx'
import { Plus, X } from 'lucide-react'
import { HTMLProps } from 'react'
import { Control, UseFormGetValues, UseFormRegister, UseFormSetValue, useFormState, useWatch } from 'react-hook-form'

interface MultiFileUploadProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  getValues: UseFormGetValues<ArticleUploadOptions>
  setValue: UseFormSetValue<ArticleUploadOptions>
  register: UseFormRegister<ArticleUploadOptions>
  control: Control<ArticleUploadOptions>
}

export default function MutliAttachmentUpload({
  getValues,
  setValue,
  register,
  className,
  control,
  ...props
}: MultiFileUploadProps): JSX.Element {
  const { errors } = useFormState({ control })
  useWatch({ control, name: 'attachments' })

  return (
    <div className={clsx('flex w-min flex-col', className)} {...props}>
      {getValues('attachments').map((_, i) => (
        <div key={i} className="mb-2 flex gap-2">
          <input
            type="text"
            className={clsx(
              'w-32 rounded-md border px-2 py-1',
              errors.attachments?.[i]?.name ? 'border-red-500' : 'border-gray-300'
            )}
            placeholder="name"
            {...register(`attachments.${i}.name`, {
              required: true,
              validate: (v) => getValues('attachments').filter((a) => a.name === v).length === 1,
            })}
          />
          <input
            type="text"
            className={clsx(
              'w-96 rounded-md border px-2 py-1',
              errors.attachments?.[i]?.url ? 'border-red-500' : 'border-gray-300'
            )}
            placeholder="url"
            {...register(`attachments.${i}.url`, {
              required: true,
              validate: (v) => v?.startsWith('https://'),
            })}
          />

          <button
            type="button"
            title="Remove"
            className="rounded-md border border-red-200 p-2"
            onClick={() => {
              const newAttachments = [...getValues('attachments')]
              newAttachments.splice(i, 1)
              setValue('attachments', newAttachments, { shouldValidate: true })
            }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
      ))}

      <button
        type="button"
        className="flex w-max items-center gap-2 rounded border border-gray-300 px-2 py-1"
        onClick={() => {
          const newFiles = [...getValues('attachments')]
          newFiles.push({ name: '', url: '' })
          setValue('attachments', newFiles, { shouldValidate: true })
        }}
      >
        <Plus size={16} strokeWidth={1.5} />
        new attachment
      </button>
    </div>
  )
}
