'use client'

import { useState, useEffect } from 'react'
import { createPublicClient, http } from 'viem'
import { monadTestnet } from 'viem/chains'
import { web3config } from '@/dapp.config'
import { blonksAbi } from '@/contracts-generated'

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
})

interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

interface NFTWithMetadata {
  tokenId: string
  originalMinter: string
  currentOwner: string
  mintTimestamp: string
  metadata?: NFTMetadata
  isLoadingMetadata: boolean
  metadataError?: string
}

// Helper function to parse metadata from URI
function parseMetadata(uri: string): NFTMetadata | null {
  try {
    const base64Data = uri.split(',')[1]
    const json = JSON.parse(atob(base64Data))
    return json
  } catch {
    return null
  }
}

export function useNFTMetadata(
  nfts: Array<{
    tokenId: string
    originalMinter: string
    currentOwner: string
    mintTimestamp: string
  }>,
) {
  const [nftsWithMetadata, setNftsWithMetadata] = useState<NFTWithMetadata[]>(
    [],
  )
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false)

  useEffect(() => {
    async function loadMetadata() {
      if (nfts.length === 0) return

      setIsLoadingMetadata(true)

      try {
        // Use viem's built-in multicall support
        const results = await publicClient.multicall({
          contracts: nfts.map((nft) => ({
            address: web3config.contractAddress,
            abi: blonksAbi,
            functionName: 'tokenURI',
            args: [BigInt(nft.tokenId)],
          })),
        })

        // Process results
        const nftsWithMetadataData: NFTWithMetadata[] = nfts.map(
          (nft, index) => {
            const result = results[index]

            if (result.status === 'success' && result.result) {
              const metadata = parseMetadata(result.result as string)
              if (metadata) {
                return {
                  ...nft,
                  metadata,
                  isLoadingMetadata: false,
                }
              }
            }

            return {
              ...nft,
              isLoadingMetadata: false,
              metadataError: 'Failed to load metadata',
            }
          },
        )

        setNftsWithMetadata(nftsWithMetadataData)
      } catch (error) {
        console.error('Error loading metadata with multicall:', error)
      } finally {
        setIsLoadingMetadata(false)
      }
    }

    loadMetadata()
  }, [nfts])

  return {
    nftsWithMetadata,
    isLoadingMetadata,
  }
}
