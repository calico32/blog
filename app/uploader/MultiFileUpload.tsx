import clsx from 'clsx'
import { ArrowDown, ArrowUp, X } from 'lucide-react'
import { HTMLProps, InputHTMLAttributes, ReactNode, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import FileInput from './FileInput'

interface MultiFileUploadProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  files?: File[]
  onChange: (files: File[]) => void
  primaryText?: string
  placeholder?: string
  accept?: string
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  validate?: (file: File) => string | ReactNode | undefined | null | boolean
}

export default function MultiFileUpload({
  files: externalFiles,
  primaryText,
  onChange,
  validate,
  placeholder,
  inputProps,
  accept,
  className,
  ...props
}: MultiFileUploadProps): JSX.Element {
  const [files, _setFiles] = useState<File[]>([])

  useEffect(() => {
    if (externalFiles) {
      _setFiles(externalFiles)
    }
  }, [externalFiles])

  const setFiles = (newState: File[]): void => {
    _setFiles(newState)
    onChange(newState)
  }

  return (
    <div className={clsx('flex w-min flex-col', className)} {...props}>
      {files.map((file, i) => (
        <div key={`${i}${file.name}`} className="mb-2 flex">
          <FileInput
            hasSelection
            text={file.name}
            key={i}
            inputProps={{
              ...inputProps,
              type: 'file',
              multiple: false,
              accept,
            }}
            onInputChange={(event) => {
              const input = event.target as HTMLInputElement
              if (!input.files?.length) return
              const file = input.files[0]
              const newFiles = [...files]
              newFiles[i] = file
              setFiles(newFiles)
            }}
          />
          <button
            title="Remove"
            className="ml-2"
            onClick={() => {
              const newFiles = [...files]
              newFiles.splice(i, 1)
              setFiles(newFiles)
            }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
          {files.length > 1 && (
            <>
              <button
                title="Move up"
                hidden={i === 0}
                className={`ml-2 ${i === 0 ? 'invisible' : ''}`}
                onClick={() => {
                  const f = [...files]
                  ;[f[i], f[i - 1]] = [f[i - 1], f[i]]
                  setFiles(f)
                }}
              >
                <ArrowUp size={16} strokeWidth={1.5} />
              </button>
              <button
                title="Move down"
                hidden={i === files.length - 1}
                className={`ml-2 ${i === files.length - 1 ? 'invisible' : ''}`}
                onClick={() => {
                  const f = [...files]
                  ;[f[i], f[i + 1]] = [f[i + 1], f[i]]
                  setFiles(f)
                }}
              >
                <ArrowDown size={16} strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>
      ))}

      <div className="flex">
        <FileInput
          text={placeholder ?? 'choose file...'}
          inputProps={{
            ...inputProps,
            type: 'file',
            multiple: true,
            accept,
          }}
          onInputChange={(event) => {
            const input = event.target as HTMLInputElement
            if (!input.files?.length) return
            const addedFiles = [...input.files]
            const newFiles = [...files]
            for (const file of addedFiles) {
              const error = validate?.(file)
              if (error) {
                toast.error(
                  <>
                    <strong>{file.name}</strong> was invalid, so it was not added.
                  </>
                )
                continue
              }
              newFiles.push(file)
            }

            setFiles(newFiles)
          }}
        />
        <button disabled tabIndex={-1} hidden className="invisible ml-2" onClick={() => {}}>
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}
