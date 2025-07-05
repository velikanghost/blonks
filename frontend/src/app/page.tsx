'use client'

import { PortraitsMintCard } from '../components/PortraitsMintCard'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000000] text-white font-mono">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <PortraitsMintCard />
          <div className="bg-[#000000] p-8 rounded-lg border border-[#49c5b6] space-y-4">
            <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center border border-[#49c5b6]">
              <svg
                className="w-24 h-24 text-[#49c5b6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Temporal ASCII Portraits</h2>
            <p className="text-gray-400">
              Join the Temporal ASCII Portraits collection - where each NFT is a
              unique ASCII art portrait that evolves over time based on
              blockchain progression. Your portrait will subtly change every 100
              blocks, creating a dynamic piece of on-chain art.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
