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

// Helper function to add delay between requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function to process NFTs in batches
async function processBatch(
  nfts: Array<{
    tokenId: string
    originalMinter: string
    currentOwner: string
    mintTimestamp: string
  }>,
  batchSize: number = 10,
  delayMs: number = 100,
): Promise<NFTWithMetadata[]> {
  const results: NFTWithMetadata[] = []

  for (let i = 0; i < nfts.length; i += batchSize) {
    const batch = nfts.slice(i, i + batchSize)

    const batchResults = await Promise.all(
      batch.map(async (nft) => {
        try {
          const uri = await publicClient.readContract({
            address: web3config.contractAddress,
            abi: blonksAbi,
            functionName: 'tokenURI',
            args: [BigInt(nft.tokenId)],
          })

          if (uri) {
            const base64Data = uri.split(',')[1]
            const json = JSON.parse(atob(base64Data))

            return {
              ...nft,
              metadata: json,
              isLoadingMetadata: false,
            }
          } else {
            return {
              ...nft,
              isLoadingMetadata: false,
              metadataError: 'No metadata found',
            }
          }
        } catch (error) {
          console.error(
            `Error fetching metadata for token ${nft.tokenId}:`,
            error,
          )
          return {
            ...nft,
            isLoadingMetadata: false,
            metadataError: 'Failed to load metadata',
          }
        }
      }),
    )

    results.push(...batchResults)

    // Add delay between batches to avoid rate limiting
    if (i + batchSize < nfts.length) {
      await delay(delayMs)
    }
  }

  return results
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
        // Process NFTs in batches to avoid rate limiting
        const nftsWithMetadataData = await processBatch(nfts, 5, 200) // 5 NFTs per batch, 200ms delay
        setNftsWithMetadata(nftsWithMetadataData)
      } catch (error) {
        console.error('Error loading metadata:', error)
        // Set NFTs without metadata as fallback
        setNftsWithMetadata(
          nfts.map((nft) => ({
            ...nft,
            isLoadingMetadata: false,
            metadataError: 'Failed to load metadata',
          })),
        )
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
