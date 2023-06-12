'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  return (
    <div>
      <Link
        className="mb-4 flex w-min items-center gap-1 px-px hover:underline"
        href="/"
        onClick={() => {
          router.replace('/')
        }}
      >
        <ArrowLeft size={18} strokeWidth={1.5} />
        home
      </Link>

      <h1 className="mb-4 text-6xl font-bold">Article Not Found</h1>
      <div className="prose">
        <p>The article you are looking for does not exist.</p>
      </div>
    </div>
  )
}
