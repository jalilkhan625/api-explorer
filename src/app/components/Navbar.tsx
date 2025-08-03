'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="w-full bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6">
        {/* Logo and App Name at Extreme Left */}
    <div className="flex items-center space-x-3 sm:space-x-4">
  <Link href="/" className="flex items-center space-x-3">
    <Image
      src="/API-logo.png"
      alt="API Explorer Logo"
      width={96}
      height={50}
      className="w-24 h-24" // Tailwind: 6rem = 96px
      priority
    />
    <div className="flex flex-col">
      <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
        API Explorer
      </span>
      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-tight">
        Your Ultimate Endpoint Playground 
      </span>
    </div>
  </Link>
</div>


        {/* Desktop Navigation Links */}
        <div className="hidden sm:flex sm:items-center sm:space-x-4 md:space-x-6">
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm md:text-base"
          >
            Home
          </Link>
          <Link
            href="/docs"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm md:text-base"
          >
            Docs
          </Link>
          <Link
            href="/about"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm md:text-base"
          >
            About
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden px-4 pb-4">
          <div className="flex flex-col space-y-2">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/docs"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
              onClick={() => setIsOpen(false)}
            >
              Docs
            </Link>
            <Link
              href="/about"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
