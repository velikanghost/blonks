'use client'

import { useAccount, useWriteContract } from 'wagmi'
import { blonksAbi } from '../contracts-generated'
import { useState, useMemo } from 'react'
import { web3config } from '../dapp.config'
import { NFTGallery } from './NFTViewer'
import { useReadContract } from 'wagmi'
import { Address } from 'viem'

const GRID_SIZE = 10

interface TileData {
  x: number
  y: number
  tokenId: number
  owner?: string
  tokenUri?: string
}

export function Grid() {
  const { address } = useAccount()
  const { writeContract: mint } = useWriteContract()
  const [viewingTokenUri, setViewingTokenUri] = useState<string | null>(null)

  // Create grid data with token IDs
  const gridData = useMemo(() => {
    const data: TileData[] = []
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const tokenId = x * GRID_SIZE + y
        data.push({ x, y, tokenId })
      }
    }
    return data
  }, [])

  // Fetch owner for a single token
  const { data: owner } = useReadContract({
    address: web3config.contractAddress as Address,
    abi: blonksAbi,
    functionName: 'ownerOf',
    args: [BigInt(0)],
  })

  // Fetch URI for a single token
  const { data: tokenUri } = useReadContract({
    address: web3config.contractAddress as Address,
    abi: blonksAbi,
    functionName: 'tokenURI',
    args: [BigInt(0)],
  })

  const handleMint = () => {
    if (!address) return
    mint({
      address: web3config.contractAddress as `0x${string}`,
      abi: blonksAbi,
      functionName: 'mint',
    })
  }

  const handleTileClick = (tokenUri?: string) => {
    if (tokenUri) {
      setViewingTokenUri(tokenUri)
      return
    }
  }

  return (
    <div className="p-4">
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleMint}
          disabled={!address}
          className="px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mint Random Tile
        </button>

        <div className="grid grid-cols-10 gap-1 max-w-3xl mx-auto">
          {gridData.map((tile) => (
            <button
              key={`${tile.x}-${tile.y}`}
              onClick={() => handleTileClick(tokenUri || undefined)}
              disabled={!owner}
              className={`
                aspect-square p-2 text-xs border rounded w-14 h-14
                ${owner === address ? 'bg-green-200 cursor-pointer' : ''}
                ${owner && owner !== address ? 'bg-red-200 cursor-pointer' : ''}
                ${!owner ? 'bg-gray-100' : ''}
              `}
            >
              {tile.x},{tile.y}
            </button>
          ))}
        </div>
      </div>

      {viewingTokenUri && <NFTGallery />}
    </div>
  )
}
