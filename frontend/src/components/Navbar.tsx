'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const NavLink = ({ href, children }: { href: string; children: string }) => {
    const isActive = pathname === href
    const isExternal = href.startsWith('http')

    const content = (
      <span className="group">
        <span
          className={isActive ? 'text-[#49c5b6]' : 'group-hover:text-[#49c5b6]'}
        >
          {'[ '}
        </span>
        <span
          className={
            isActive
              ? 'text-[#49c5b6] font-bold'
              : 'text-white group-hover:text-[#49c5b6] font-bold'
          }
        >
          {children}
        </span>
        <span
          className={isActive ? 'text-[#49c5b6]' : 'group-hover:text-[#49c5b6]'}
        >
          {' ]'}
        </span>
      </span>
    )

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#49c5b6]"
        >
          {content}
        </a>
      )
    }

    return (
      <Link href={href} className="hover:text-[#49c5b6]">
        {content}
      </Link>
    )
  }

  return (
    <nav className="border-b border-[#49c5b6]">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#49c5b6] w-[15%]">Blonks</h1>
        <div className="flex items-center gap-[56px]">
          <NavLink href="/">Mint</NavLink>
          <NavLink href="/gallery">Gallery</NavLink>
          <NavLink href="/inventory">Inventory</NavLink>
        </div>
        <ConnectButton />
      </div>
    </nav>
  )
}
