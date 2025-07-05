'use client'

import { useAccount } from 'wagmi'
import { useReadContract } from 'wagmi'
import { Address } from 'viem'
import { web3config } from '@/dapp.config'
import { portraitsAbi } from '@/contracts-generated'
import { PortraitsMintCard } from '@/components/PortraitsMintCard'
import { useState } from 'react'
import Navbar from '@/components/Navbar'

function getImageURL(mintedTokenURI: string): string | undefined {
  try {
    console.log('Raw tokenURI:', mintedTokenURI)

    // Portraits return data:application/json;base64,<data>
    // We need to decode the base64 JSON and extract the image URL
    const base64Data = mintedTokenURI.split(',')[1]
    console.log('Base64 data:', base64Data)
    const json = JSON.parse(atob(base64Data))
    console.log('Parsed JSON:', json)
    return json.image
  } catch (error) {
    console.error('Error parsing tokenURI:', error)
    return undefined
  }
}

function GetTokenURI({ tokenId }: { tokenId: number }) {
  const {
    data: tokenURI,
    isLoading,
    isError,
    error,
  } = useReadContract({
    address: web3config.contractAddress as Address,
    abi: portraitsAbi,
    functionName: 'tokenURI',
    args: [BigInt(tokenId)],
  })

  console.log('tokenURI result:', { tokenURI, isLoading, isError, error })

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center border border-[#49c5b6]">
        <div className="text-[#49c5b6]">Loading...</div>
      </div>
    )
  }

  if (isError) {
    console.error('Error loading tokenURI:', error)
    return (
      <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center border border-[#49c5b6]">
        <div className="text-red-500">Error loading NFT</div>
      </div>
    )
  }

  if (!tokenURI) {
    return (
      <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center border border-[#49c5b6]">
        <div className="text-gray-500">No data</div>
      </div>
    )
  }

  const imageURL = getImageURL(tokenURI)

  return (
    <div className="w-full">
      <div className="bg-gray-800 rounded-lg border border-[#49c5b6] p-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#49c5b6]">
            Portrait #{tokenId}
          </h3>
        </div>
        {imageURL && (
          <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={imageURL}
              alt={`Portrait #${tokenId}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function GetAndShowToken({
  address,
  tokenId,
}: {
  address: string
  tokenId: number
}) {
  console.log('GetAndShowToken called:', { address, tokenId })

  const {
    data: owner,
    isLoading: isLoadingOwner,
    isError: isErrorOwner,
    error: ownerError,
  } = useReadContract({
    address: web3config.contractAddress as Address,
    abi: portraitsAbi,
    functionName: 'ownerOf',
    args: [BigInt(tokenId)],
  })

  console.log('ownerOf result:', {
    owner,
    isLoadingOwner,
    isErrorOwner,
    ownerError,
  })

  if (isLoadingOwner || isErrorOwner || owner !== address) return null

  return <GetTokenURI tokenId={tokenId} />
}

function GetAndShowTokenByIndex({
  address,
  tokenNumber,
}: {
  address: string
  tokenNumber: number
}) {
  console.log('GetAndShowTokenByIndex called:', {
    address,
    tokenNumber,
  })

  const {
    data: tokenId,
    isLoading: isLoadingToken,
    isError: isErrorToken,
    error: tokenError,
  } = useReadContract({
    address: web3config.contractAddress as Address,
    abi: portraitsAbi,
    functionName: 'tokenOfOwnerByIndex',
    args: [address as Address, BigInt(tokenNumber)],
  })

  console.log('tokenOfOwnerByIndex result:', {
    tokenId,
    isLoadingToken,
    isErrorToken,
    tokenError,
  })

  if (isLoadingToken || isErrorToken) return null

  return <GetTokenURI tokenId={Number(tokenId)} />
}

function ShowMyTokens({ address }: { address: string }) {
  console.log('ShowMyTokens called with:', {
    address,
    contractAddress: web3config.contractAddress,
  })

  const {
    data: tokens,
    isLoading: isLoadingTokens,
    isError: isErrorTokens,
    error,
  } = useReadContract({
    address: web3config.contractAddress as Address,
    abi: portraitsAbi,
    functionName: 'balanceOf',
    args: [address as Address],
  })

  console.log('Contract read result:', {
    tokens,
    isLoadingTokens,
    isErrorTokens,
    error,
  })

  if (isLoadingTokens) {
    return (
      <div className="text-center text-[#49c5b6]">
        Loading your collection...
      </div>
    )
  }

  if (isErrorTokens) {
    console.error('Contract error details:', error)
    return (
      <div className="text-center text-red-500">
        Failed to load your collection. Please try again.
      </div>
    )
  }

  const balance = Number(tokens)
  console.log('Parsed balance:', balance)

  if (balance === 0) {
    return (
      <div className="text-center text-gray-400">
        You don't have any Portraits yet. Head to the mint page to get started!
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">My Collection</h1>
        <div className="text-[#49c5b6]">{balance} Portraits</div>
      </div>
      <VisualizeMyTokens address={address} balance={balance} />
    </div>
  )
}

function VisualizeMyTokens({
  address,
  balance,
}: {
  address: string
  balance: number
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: balance }, (_, i) => (
        <GetAndShowTokenByIndex key={i} address={address} tokenNumber={i} />
      ))}
    </div>
  )
}

export default function Inventory() {
  const { address } = useAccount()
  const [showMint, setShowMint] = useState(false)

  return (
    <div className="min-h-screen bg-[#000000] text-white font-mono">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">My Portraits</h1>
          <button
            onClick={() => setShowMint(!showMint)}
            className="px-6 py-3 bg-[#49c5b6] text-black rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            {showMint ? 'Hide Mint' : 'Show Mint'}
          </button>
        </div>

        {showMint && (
          <div className="mb-8">
            <PortraitsMintCard />
          </div>
        )}

        {address ? (
          <ShowMyTokens address={address} />
        ) : (
          <div className="text-center text-gray-400">
            Connect your wallet to view your collection
          </div>
        )}
      </div>
    </div>
  )
}
