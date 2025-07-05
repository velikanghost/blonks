'use client'

import { useAccount } from 'wagmi'
import { useReadContract } from 'wagmi'
import { Address } from 'viem'
import { web3config } from '@/dapp.config'
import { gatherersAbi } from '@/contracts-generated'
import { portraitsAbi } from '@/contracts-generated'
import { MintCard } from '@/components/MintCard'
import { PortraitsMintCard } from '@/components/PortraitsMintCard'
import { useState } from 'react'
import Navbar from '@/components/Navbar'

function getImageURL(
  mintedTokenURI: string,
  isPortrait: boolean,
): string | undefined {
  try {
    console.log('Raw tokenURI:', mintedTokenURI)

    // Both Portraits and Gatherers return data:application/json;base64,<data>
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

function GetTokenURI({
  tokenId,
  isPortrait = false,
}: {
  tokenId: number
  isPortrait?: boolean
}) {
  console.log('GetTokenURI called:', { tokenId, isPortrait })

  const {
    data: tokenURI,
    isLoading: isLoadingTokenURI,
    isError: isErrorTokenURI,
    error: uriError,
  } = useReadContract({
    address: (isPortrait
      ? web3config.portraitsContractAddress
      : web3config.contractAddress) as Address,
    abi: isPortrait ? portraitsAbi : gatherersAbi,
    functionName: 'tokenURI',
    args: [BigInt(tokenId)],
  })

  console.log('tokenURI result:', {
    tokenURI,
    isLoadingTokenURI,
    isErrorTokenURI,
    uriError,
  })

  if (isLoadingTokenURI) {
    return (
      <div className="w-[450px] h-[450px] flex items-center justify-center border border-[#49c5b6] rounded-lg bg-black">
        <div className="text-[#49c5b6]">Loading...</div>
      </div>
    )
  }

  if (isErrorTokenURI) {
    console.error('TokenURI error:', uriError)
    // If the error is because the token doesn't exist, just return null
    if (uriError?.message?.includes('Token does not exist')) {
      return null
    }
    return (
      <div className="w-[450px] h-[450px] flex items-center justify-center border border-red-500 rounded-lg bg-black">
        <div className="text-red-500">Failed to load</div>
      </div>
    )
  }

  const imageUrl = getImageURL(tokenURI as string, isPortrait)
  console.log('Processed image URL:', imageUrl)

  return (
    <div className="w-[450px] h-[450px] flex flex-col items-center p-4 border border-[#49c5b6] rounded-lg bg-black hover:border-2 transition-all">
      <div className="w-full h-full flex items-center justify-center portrait-container">
        {imageUrl ? (
          <div
            dangerouslySetInnerHTML={{
              __html: imageUrl.startsWith('data:image/svg+xml;base64,')
                ? atob(imageUrl.split(',')[1])
                : `<img src="${imageUrl}" alt="Token #${tokenId}" class="max-w-full max-h-full w-auto h-auto" />`,
            }}
            className="w-full h-full"
          />
        ) : (
          <div className="text-red-500">Invalid image data</div>
        )}
      </div>
      <div className="mt-2 text-sm text-gray-400">Token #{tokenId}</div>
    </div>
  )
}

function GetAndShowToken({
  address,
  tokenId,
  isPortrait = false,
}: {
  address: string
  tokenId: number
  isPortrait?: boolean
}) {
  console.log('GetAndShowToken called:', { address, tokenId, isPortrait })

  const {
    data: owner,
    isLoading: isLoadingOwner,
    isError: isErrorOwner,
    error: ownerError,
  } = useReadContract({
    address: (isPortrait
      ? web3config.portraitsContractAddress
      : web3config.contractAddress) as Address,
    abi: isPortrait ? portraitsAbi : gatherersAbi,
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

  return <GetTokenURI tokenId={tokenId} isPortrait={isPortrait} />
}

function VisualizeMyTokens({
  address,
  balance,
  isPortrait = false,
}: {
  address: string
  balance: number
  isPortrait?: boolean
}) {
  // Both contracts now support tokenOfOwnerByIndex
  const tokens = Array.from({ length: balance }, (_, i) => (
    <GetAndShowTokenByIndex
      key={i}
      address={address}
      tokenNumber={i}
      isPortrait={isPortrait}
    />
  ))

  return <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{tokens}</div>
}

function GetAndShowTokenByIndex({
  address,
  tokenNumber,
  isPortrait = false,
}: {
  address: string
  tokenNumber: number
  isPortrait?: boolean
}) {
  console.log('GetAndShowTokenByIndex called:', {
    address,
    tokenNumber,
    isPortrait,
  })

  const {
    data: tokenId,
    isLoading: isLoadingToken,
    isError: isErrorToken,
    error: tokenError,
  } = useReadContract({
    address: (isPortrait
      ? web3config.portraitsContractAddress
      : web3config.contractAddress) as Address,
    abi: isPortrait ? portraitsAbi : gatherersAbi,
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

  return <GetTokenURI tokenId={Number(tokenId)} isPortrait={isPortrait} />
}

function ShowMyTokens({
  address,
  isPortrait = false,
}: {
  address: string
  isPortrait?: boolean
}) {
  console.log('ShowMyTokens called with:', {
    address,
    isPortrait,
    contractAddress: isPortrait
      ? web3config.portraitsContractAddress
      : web3config.contractAddress,
  })

  const {
    data: tokens,
    isLoading: isLoadingTokens,
    isError: isErrorTokens,
    error,
  } = useReadContract({
    address: (isPortrait
      ? web3config.portraitsContractAddress
      : web3config.contractAddress) as Address,
    abi: isPortrait ? portraitsAbi : gatherersAbi,
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
        You don't have any {isPortrait ? 'Portraits' : 'Gatherers'} yet. Head to
        the mint page to get started!
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">My Collection</h1>
        <div className="text-[#49c5b6]">
          {balance} {isPortrait ? 'Portraits' : 'Gatherers'}
        </div>
      </div>
      <VisualizeMyTokens
        address={address}
        balance={balance}
        isPortrait={isPortrait}
      />
    </div>
  )
}

export default function MyTokens() {
  const { isConnected, address } = useAccount()
  const [activeTab, setActiveTab] = useState<'gatherers' | 'portraits'>(
    'gatherers',
  )

  return (
    <main className="min-h-screen bg-[#000000] text-white font-mono">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8">
        {!isConnected ? (
          <div className="text-center text-gray-400 mt-20">
            Connect your wallet to view your collection
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab('gatherers')}
                className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                  activeTab === 'gatherers'
                    ? 'bg-[#49c5b6] text-black'
                    : 'border border-[#49c5b6] text-[#49c5b6] hover:bg-[#49c5b6] hover:text-black'
                }`}
              >
                Gatherers
              </button>
              <button
                onClick={() => setActiveTab('portraits')}
                className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                  activeTab === 'portraits'
                    ? 'bg-[#49c5b6] text-black'
                    : 'border border-[#49c5b6] text-[#49c5b6] hover:bg-[#49c5b6] hover:text-black'
                }`}
              >
                Portraits
              </button>
            </div>
            <ShowMyTokens
              address={address as string}
              isPortrait={activeTab === 'portraits'}
            />
          </>
        )}
      </div>
    </main>
  )
}
