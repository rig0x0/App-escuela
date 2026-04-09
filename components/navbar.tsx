import Link from 'next/link'
import React from 'react'
import { buttonVariants } from './ui/button'
import { ModeToggle } from './theme-toggle-button'

export default function Navbar() {
  return (
    <nav className="flex justify-between py-5 bg-red-100">
      <Link href='/'>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100"> NextActionsCRUD</h1>
      </Link>

        <div className="flex gap-x-2 item-start">
            <Link href="/new" className={buttonVariants({variant: "secondary"})} >Create Task</Link>
            <ModeToggle />
        </div>
    </nav>
  )
}

