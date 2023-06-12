export default function Footer(): JSX.Element {
  return (
    <footer className="mx-auto mb-16 flex max-w-[65ch] gap-2 text-gray-400">
      <div>© {new Date().getFullYear()} calico32</div>
      <span>•</span>
      <div>
        <a href="http://creativecommons.org/licenses/by-nc/4.0" target="_blank" className="hover:underline">
          CC BY-NC 4.0
        </a>
      </div>
    </footer>
  )
}
