import clsx from 'clsx'
import { HTMLProps, useRef } from 'react'
import styles from './FileInput.module.scss'

interface FileInputProps extends HTMLProps<HTMLLabelElement> {
  disabled?: boolean
  fill?: boolean
  hasSelection?: boolean
  inputProps?: React.HTMLProps<HTMLInputElement>
  large?: boolean
  onInputChange?: React.FormEventHandler<HTMLInputElement>
  small?: boolean
  text?: React.ReactNode
  buttonText?: string
}

export default function FileInput(props: FileInputProps) {
  const {
    buttonText,
    className,
    disabled,
    fill,
    hasSelection,
    inputProps,
    large,
    onInputChange,
    small,
    text,
    ...htmlProps
  } = props
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <label
      {...htmlProps}
      className={clsx(
        'inline-flex h-[33.79px] w-72 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap',
        className,
        styles['file-input']
      )}
    >
      <input
        {...inputProps}
        onChange={(e) => {
          props.onInputChange?.(e)
          props.inputProps?.onChange?.(e)
        }}
        hidden
        type="file"
        disabled={disabled}
        ref={inputRef}
      />
      <span
        className={clsx(
          'inset-0 flex h-full flex-grow select-none items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-md rounded-r-none border border-r-0 border-gray-500 px-3 py-1',
          hasSelection ? 'text-black' : 'text-gray-400'
        )}
      >
        {text}
      </span>
      <button
        type="button"
        className="rounded-r-md border border-sky-600 bg-sky-600 px-3 py-1 text-center text-white hover:border-sky-700 hover:bg-sky-700 active:border-sky-800 active:bg-sky-800"
        onClick={() => inputRef.current?.click()}
      >
        browse
      </button>
    </label>
  )
}
