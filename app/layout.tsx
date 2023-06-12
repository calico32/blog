import clsx from 'clsx'
import { Noto_Sans_JP, Wix_Madefor_Text } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'
import Footer from './Footer'

const wixMadeforText = Wix_Madefor_Text({
  subsets: ['latin'],
  variable: '--wix-madefor-text',
  preload: true,
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin-ext'],
  variable: '--noto-sans-jp',
  preload: true,
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={clsx(wixMadeforText.variable, notoSansJP.variable, 'mx-8 mt-8 font-sans text-black lg:mt-32')}>
        <Toaster />
        <div className="mx-auto max-w-[65ch]">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
