import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Article Uploader',
}

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
  return <>{children}</>
}
