'use client'

import Navbar from '@/components/Navbar'
import { useAccount } from 'wagmi'
import { useGalleryData } from '@/hooks/useGalleryData'
import { useNFTMetadata } from '@/hooks/useNFTMetadata'
import { useBlockNumber } from 'wagmi'
import { useEffect, useMemo } from 'react'

export default function Inventory() {
  const { address } = useAccount()
  const { nfts, isLoading, error, refreshGallery } = useGalleryData()
  const { nftsWithMetadata, isLoadingMetadata } = useNFTMetadata(nfts)
  const { data: blockNumber } = useBlockNumber({ watch: true })

  // Filter NFTs owned by current user from all loaded NFTs
  const userNFTs = useMemo(() => {
    if (!address || !nftsWithMetadata.length) return []
    return nftsWithMetadata.filter(
      (nft) => nft.currentOwner.toLowerCase() === address.toLowerCase(),
    )
  }, [address, nftsWithMetadata])

  // Auto-refresh every 100 blocks to see NFT evolution
  useEffect(() => {
    if (!blockNumber) return
    const bn = Number(blockNumber)
    if (bn % 100 === 0) {
      refreshGallery()
    }
  }, [blockNumber, refreshGallery])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#000000] text-white font-mono">
        <Navbar />
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49c5b6] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading inventory...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#000000] text-white font-mono">
        <Navbar />
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="text-center py-12">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Error Loading Inventory
            </h3>
            <p className="text-red-400 mb-6">{error}</p>
            <button
              onClick={refreshGallery}
              className="bg-[#49c5b6] text-black px-6 py-2 rounded-lg hover:bg-[#3ba697] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#000000] text-white font-mono">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#49c5b6]">
            My Blonks
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Your personal collection of evolving ASCII portraits.
          </p>
        </div>

        {!address ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-gray-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-400 mb-6">
              Connect your wallet to view your Blonks collection.
            </p>
          </div>
        ) : !userNFTs.length ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-gray-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Blonks Found
            </h3>
            <p className="text-gray-400 mb-6">
              You don't own any Blonks yet. Mint your first one!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Your Collection ({userNFTs.length} Blonks)
              </h2>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#49c5b6] rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Live evolving art</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {userNFTs.map((nft) => (
                <div
                  key={nft.tokenId}
                  className="bg-gray-900 rounded-lg border border-[#49c5b6] p-4 hover:border-[#3ba697] transition-all duration-200 group hover:scale-[1.02]"
                >
                  <div className="aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden relative">
                    {nft.metadata?.image ? (
                      <img
                        src={nft.metadata.image}
                        alt={`Blonk #${nft.tokenId}`}
                        className="w-full h-full object-contain"
                      />
                    ) : isLoadingMetadata ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#49c5b6]"></div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white font-bold text-lg group-hover:text-[#49c5b6] transition-colors">
                      Blonk #{nft.tokenId}
                    </h3>

                    <div className="space-y-1 text-sm">
                      <p className="text-gray-400">
                        Minter: {formatAddress(nft.originalMinter)}
                      </p>
                      {nft.currentOwner !== nft.originalMinter && (
                        <p className="text-gray-400">
                          Acquired: {formatDate(nft.mintTimestamp)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                        Evolving Art
                      </span>
                      <span className="text-xs text-[#49c5b6]">Live</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>
                Each Blonk evolves every 100 blocks, creating unique temporal
                art
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
