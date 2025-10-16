"use client"

import React from 'react'
import { Alexandria } from 'next/font/google'
import { Button } from '@/components/ui/button'

const alexandria = Alexandria({ subsets: ['latin'] })

function NavBar() {
  const [isClub, setIsClub] = React.useState(false);
  
  return (
    <header className='h-14 flex items-center justify-between px-8 border-b-[1px] border-neutral-200'>
      <h1 className={alexandria.className}>PROJECT X</h1>
      <nav className='flex justify-between items-center gap-2'>
        <Button variant={'ghost'} className='text-primary'>Login</Button>
        <Button className={`bg-primary text-primary-foreground ${!isClub ? 'hidden' : ''}`}>Add Club Event</Button>
      </nav>
    </header>
  )
}

export default NavBar