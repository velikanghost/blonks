'use client'

import Navbar from '@/components/Navbar'
import { useGalleryData } from '@/hooks/useGalleryData'
import { useNFTMetadata } from '@/hooks/useNFTMetadata'
import { useBlockNumber } from 'wagmi'
import { useEffect } from 'react'

export default function Gallery() {
  const {
    nfts,
    isLoading,
    error,
    lastUpdated,
    refreshGallery,
    loadNextPage,
    hasMore,
    totalSupply,
  } = useGalleryData()
  const { nftsWithMetadata, isLoadingMetadata } = useNFTMetadata(nfts)
  const { data: blockNumber } = useBlockNumber({ watch: true })

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
            <p className="text-gray-400">Loading gallery...</p>
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
              Error Loading Gallery
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
            Blonks Gallery
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore all minted Blonks. Each piece is unique and evolves over
            time, creating a living collection of on-chain art.
          </p>
        </div>

        {!nfts.length ? (
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
              No Blonks Minted Yet
            </h3>
            <p className="text-gray-400 mb-6">
              Be the first to mint a unique Blonk!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Blonks Gallery ({totalSupply} minted)
              </h2>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#49c5b6] rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Live evolving art</span>
              </div>
            </div>

            {lastUpdated && (
              <div className="text-sm text-gray-500 text-center">
                Last updated: {lastUpdated.toLocaleString()}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {nftsWithMetadata.map((nft) => (
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
                          Owner: {formatAddress(nft.currentOwner)}
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

            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadNextPage}
                  disabled={isLoadingMetadata}
                  className="bg-[#49c5b6] text-black px-8 py-3 rounded-lg hover:bg-[#3ba697] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMetadata ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}

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
