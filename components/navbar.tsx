import Link from 'next/link'
import { ModeToggle } from './theme-toggle-button'

export default function Navbar() {
  return (
    <nav className="py-5 bg-red-100">
      <div className='m-1 flex justify-between'>
      <Link href='/'>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100"> NextActionsCRUD</h1>
      </Link>

        <div className="flex gap-x-2 item-start">
            <ModeToggle />
        </div>
        </div>
    </nav>
  )
}

