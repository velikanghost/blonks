'use client'

import { useReadContract } from 'wagmi'
import { Address } from 'viem'
import { web3config } from '@/dapp.config'
import {
  portraitsAbi,
  useReadPortraitsTotalSupply,
} from '@/contracts-generated'
import { useState } from 'react'

function NFTCard({ tokenId }: { tokenId: number }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const {
    data: tokenURI,
    isLoading,
    isError,
  } = useReadContract({
    address: web3config.contractAddress as Address,
    abi: portraitsAbi,
    functionName: 'tokenURI',
    args: [BigInt(tokenId)],
  })

  const { data: originalMinter } = useReadContract({
    address: web3config.contractAddress as Address,
    abi: portraitsAbi,
    functionName: 'originalMinter',
    args: [BigInt(tokenId)],
  })

  const getImageURL = (mintedTokenURI: string): string | undefined => {
    try {
      const base64Data = mintedTokenURI.split(',')[1]
      const json = JSON.parse(atob(base64Data))
      return json.image
    } catch (error) {
      console.error('Error parsing tokenURI:', error)
      return undefined
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 animate-pulse">
        <div className="aspect-square bg-gray-800 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-800 rounded w-1/2"></div>
      </div>
    )
  }

  if (isError || !tokenURI) {
    return (
      <div className="bg-gray-900 rounded-lg border border-red-700 p-4">
        <div className="aspect-square bg-red-900/20 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-red-400 text-sm">Failed to load</span>
        </div>
        <h3 className="text-white font-bold">Portrait #{tokenId}</h3>
        <p className="text-red-400 text-sm">Error loading NFT</p>
      </div>
    )
  }

  const imageURL = getImageURL(tokenURI)

  return (
    <div className="bg-gray-900 rounded-lg border border-[#49c5b6] p-4 hover:border-[#3ba697] transition-all duration-200 group hover:scale-[1.02]">
      <div className="aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden relative">
        {imageURL && (
          <>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#49c5b6]"></div>
              </div>
            )}
            <img
              src={imageURL}
              alt={`Portrait #${tokenId}`}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center text-red-400">
                Failed to load image
              </div>
            )}
          </>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-white font-bold text-lg group-hover:text-[#49c5b6] transition-colors">
          Portrait #{tokenId}
        </h3>
        {originalMinter && (
          <p className="text-gray-400 text-sm font-mono">
            Minter: {originalMinter.slice(0, 6)}...{originalMinter.slice(-4)}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
            Evolving Art
          </span>
          <span className="text-xs text-[#49c5b6]">Live</span>
        </div>
      </div>
    </div>
  )
}

export function NFTGallery() {
  const { data: totalSupply, isLoading: isLoadingSupply } =
    useReadPortraitsTotalSupply({
      address: web3config.contractAddress,
    })

  const totalNFTs = Number(totalSupply || 0)

  if (isLoadingSupply) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49c5b6] mx-auto mb-4"></div>
        <p className="text-gray-400">Loading gallery...</p>
      </div>
    )
  }

  if (totalNFTs === 0) {
    return (
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
          No Portraits Minted Yet
        </h3>
        <p className="text-gray-400 mb-6">
          Be the first to mint a unique temporal ASCII portrait!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Portrait Gallery ({totalNFTs} minted)
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-[#49c5b6] rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Live evolving art</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: totalNFTs }, (_, i) => (
          <NFTCard key={i + 1} tokenId={i + 1} />
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>
          Each portrait evolves every 100 blocks, creating unique temporal art
        </p>
        <p>Refresh the page to see the latest evolution state</p>
      </div>
    </div>
  )
}
