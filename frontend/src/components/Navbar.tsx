'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
      <Link
        href={href}
        className="hover:text-[#49c5b6]"
        onClick={() => setIsMenuOpen(false)}
      >
        {content}
      </Link>
    )
  }

  return (
    <nav className="border-b border-[#49c5b6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#49c5b6]">
            Blonks
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/">Mint</NavLink>
            <NavLink href="/gallery">Gallery</NavLink>
            <NavLink href="/inventory">Inventory</NavLink>
          </div>

          <div className="hidden md:block">
            <ConnectButton />
          </div>

          {/* Mobile Navigation Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#49c5b6] hover:text-[#3ba697]"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <div className="flex flex-col gap-4">
              <NavLink href="/">Mint</NavLink>
              <NavLink href="/gallery">Gallery</NavLink>
              <NavLink href="/inventory">Inventory</NavLink>
            </div>
            <div className="pt-4">
              <ConnectButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
