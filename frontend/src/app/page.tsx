'use client'

import { PortraitsMintCard } from '../components/PortraitsMintCard'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000000] text-white font-mono">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#49c5b6]">
            Blonks
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Unique ASCII art portraits that evolve over time based on blockchain
            progression. Each blonk is generated from your wallet address and
            changes every 100 blocks.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Mint Section */}
          <div className="lg:col-span-1">
            <PortraitsMintCard />
          </div>

          {/* Description Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-[#49c5b6]">
                How It Works
              </h2>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start space-x-3">
                  <span className="text-[#49c5b6] font-bold">1.</span>
                  <div>
                    <h3 className="font-semibold mb-1">Mint Your Blonk</h3>
                    <p className="text-sm text-gray-400">
                      Connect your wallet and mint a unique ASCII portrait based
                      on your address.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[#49c5b6] font-bold">2.</span>
                  <div>
                    <h3 className="font-semibold mb-1">Watch It Evolve</h3>
                    <p className="text-sm text-gray-400">
                      Your blonk changes every 100 blocks, creating a living
                      piece of art.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[#49c5b6] font-bold">3.</span>
                  <div>
                    <h3 className="font-semibold mb-1">Truly Unique</h3>
                    <p className="text-sm text-gray-400">
                      Each blonk is generated from your wallet address - no two
                      blonks are alike.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
              <h3 className="font-bold mb-3 text-[#49c5b6]">
                Technical Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Price:</span>
                  <span className="text-white ml-2">0.1 MON</span>
                </div>
                <div>
                  <span className="text-gray-400">Max Supply:</span>
                  <span className="text-white ml-2">500</span>
                </div>
                <div>
                  <span className="text-gray-400">Per Wallet:</span>
                  <span className="text-white ml-2">1 NFT</span>
                </div>
                <div>
                  <span className="text-gray-400">Evolution:</span>
                  <span className="text-white ml-2">Every 100 blocks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
