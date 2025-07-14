'use client'

import { useAccount, useBlockNumber } from 'wagmi'
import { useReadContract } from 'wagmi'
import { Address, createPublicClient, http } from 'viem'
import { monadTestnet } from 'viem/chains'
import { web3config } from '@/dapp.config'
import { blonksAbi } from '@/contracts-generated'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
})

interface NFTData {
  id: number
  uri?: string
  image?: string
}

export default function Inventory() {
  const { address } = useAccount()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const [nfts, setNfts] = useState<NFTData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Get tokens owned by address
  const { data: tokenIds } = useReadContract({
    address: web3config.contractAddress as Address,
    abi: blonksAbi,
    functionName: 'tokensOfOwner',
    args: [address as Address],
    query: {
      enabled: !!address,
    },
  })

  // Get URIs for tokens
  useEffect(() => {
    async function getTokenURIs() {
      if (!tokenIds?.length) {
        setIsLoading(false)
        return
      }

      setNfts(tokenIds.map((id) => ({ id: Number(id) })))

      for (const id of tokenIds) {
        try {
          const uri = await publicClient.readContract({
            address: web3config.contractAddress,
            abi: blonksAbi,
            functionName: 'tokenURI',
            args: [id],
          })

          if (uri) {
            const base64Data = uri.split(',')[1]
            const json = JSON.parse(atob(base64Data))

            setNfts((current) =>
              current.map((nft) =>
                nft.id === Number(id)
                  ? { ...nft, uri, image: json.image }
                  : nft,
              ),
            )
          }
        } catch (error) {
          console.error(`Error fetching URI for token ${id}:`, error)
        }
      }
      setIsLoading(false)
    }

    getTokenURIs()
  }, [tokenIds, refreshTrigger])

  // Refresh every 100 blocks
  useEffect(() => {
    if (!blockNumber) return
    const bn = Number(blockNumber)
    if (bn % 100 === 0) {
      setRefreshTrigger((prev) => prev + 1)
    }
  }, [blockNumber])

  return (
    <div className="min-h-screen bg-[#000000] text-white font-mono">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">My Blonks</h1>
          <div className="text-[#49c5b6]">{nfts.length} blonks</div>
        </div>

        {!address ? (
          <div className="text-center text-gray-400">
            Connect your wallet to view your collection
          </div>
        ) : isLoading ? (
          <div className="text-center text-[#49c5b6]">
            Loading your collection...
          </div>
        ) : !nfts.length ? (
          <div className="text-center text-gray-400">
            You don&apos;t have any blonks yet. Head to the mint page to get
            started!
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <div key={nft.id} className="w-full">
                  <div className="bg-gray-800 rounded-lg border border-[#49c5b6] p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-[#49c5b6]">
                        Blonk #{nft.id}
                      </h3>
                    </div>
                    {nft.image ? (
                      <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={nft.image}
                          alt={`Blonk #${nft.id}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-[#49c5b6]">Loading...</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
