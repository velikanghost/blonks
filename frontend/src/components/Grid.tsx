'use client'

import { useAccount, useWriteContract } from 'wagmi'
import {
  useReadPortraits,
  useReadPortraitsTokenUri,
  useReadPortraitsOwnerOf,
  portraitsAbi,
} from '../contracts-generated'
import { useState } from 'react'
import { web3config } from '../dapp.config'
import { NFTViewer } from './NFTViewer'

const GRID_SIZE = 10

export function Grid() {
  const { address } = useAccount()
  const { writeContract: mint } = useWriteContract()
  const [viewingTokenUri, setViewingTokenUri] = useState<string | null>(null)

  // Create a 10x10 grid array
  const grid = Array.from({ length: GRID_SIZE }, (_, x) =>
    Array.from({ length: GRID_SIZE }, (_, y) => ({ x, y })),
  )

  const handleMint = () => {
    if (!address) return // Not connected
    mint({
      address: web3config.contractAddress as `0x${string}`,
      abi: portraitsAbi,
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
          {grid.map((row, x) =>
            row.map(({ y }) => {
              const tokenId = x * GRID_SIZE + y
              const { data: owner } = useReadPortraitsOwnerOf({
                args: [BigInt(tokenId)],
              })
              const { data: tokenUri } = useReadPortraitsTokenUri({
                args: [BigInt(tokenId)],
              })

              return (
                <button
                  key={`${x}-${y}`}
                  onClick={() => handleTileClick(tokenUri)}
                  disabled={!owner}
                  className={`
                    aspect-square p-2 text-xs border rounded w-14 h-14
                    ${owner === address ? 'bg-green-200 cursor-pointer' : ''}
                    ${owner && owner !== address ? 'bg-red-200 cursor-pointer' : ''}
                    ${!owner ? 'bg-gray-100' : ''}
                  `}
                >
                  {x},{y}
                </button>
              )
            }),
          )}
        </div>
      </div>

      {viewingTokenUri && (
        <NFTViewer
          tokenUri={viewingTokenUri}
          onClose={() => setViewingTokenUri(null)}
        />
      )}
    </div>
  )
}
