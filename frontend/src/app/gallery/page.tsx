'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { createPublicClient, http } from 'viem'
import { monadTestnet } from 'viem/chains'
import { web3config } from '@/dapp.config'
import { blonksAbi } from '@/contracts-generated'
import { useBlockNumber } from 'wagmi'

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
})

interface NFTData {
  id: number
  uri?: string
  image?: string
  minter?: string
}

export default function Gallery() {
  const [nfts, setNfts] = useState<NFTData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    async function loadNFTs() {
      try {
        // Get total supply
        const totalSupply = await publicClient.readContract({
          address: web3config.contractAddress,
          abi: blonksAbi,
          functionName: 'totalSupply',
        })

        if (!totalSupply) {
          setIsLoading(false)
          return
        }

        // Initialize NFTs array with IDs
        const initialNfts = Array.from(
          { length: Number(totalSupply) },
          (_, i) => ({
            id: i + 1,
          }),
        )
        setNfts(initialNfts)

        // Fetch data for each NFT
        for (const nft of initialNfts) {
          try {
            // Get token URI
            const uri = await publicClient.readContract({
              address: web3config.contractAddress,
              abi: blonksAbi,
              functionName: 'tokenURI',
              args: [BigInt(nft.id)],
            })

            // Get original minter
            const minter = await publicClient.readContract({
              address: web3config.contractAddress,
              abi: blonksAbi,
              functionName: 'originalMinter',
              args: [BigInt(nft.id)],
            })

            if (uri) {
              const base64Data = uri.split(',')[1]
              const json = JSON.parse(atob(base64Data))

              setNfts((current) =>
                current.map((item) =>
                  item.id === nft.id
                    ? {
                        ...item,
                        uri,
                        image: json.image,
                        minter: minter as string,
                      }
                    : item,
                ),
              )
            }
          } catch (error) {
            console.error(`Error fetching data for token ${nft.id}:`, error)
          }
        }
      } catch (error) {
        console.error('Error fetching total supply:', error)
      }
      setIsLoading(false)
    }

    loadNFTs()
  }, [refreshTrigger])

  useEffect(() => {
    if (!blockNumber) return
    const bn = Number(blockNumber)
    if (bn % 100 === 0) {
      setRefreshTrigger((prev) => prev + 1)
    }
  }, [blockNumber])

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

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#49c5b6] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading gallery...</p>
          </div>
        ) : !nfts.length ? (
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
                Blonks Gallery ({nfts.length} minted)
              </h2>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#49c5b6] rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Live evolving art</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="bg-gray-900 rounded-lg border border-[#49c5b6] p-4 hover:border-[#3ba697] transition-all duration-200 group hover:scale-[1.02]"
                >
                  <div className="aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden relative">
                    {nft.image ? (
                      <img
                        src={nft.image}
                        alt={`Portrait #${nft.id}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#49c5b6]"></div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white font-bold text-lg group-hover:text-[#49c5b6] transition-colors">
                      Blonk #{nft.id}
                    </h3>
                    {nft.minter && (
                      <p className="text-gray-400 text-sm font-mono">
                        Minter: {nft.minter.slice(0, 6)}...
                        {nft.minter.slice(-4)}
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
              ))}
            </div>

            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>
                Each Blonk evolves every 100 blocks, creating unique temporal
                art
              </p>
              <p>Auto-updated every 100 blocks</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
