'use client'

import { useEffect, useState } from 'react'

interface NFTMetadata {
  image?: string
  name?: string
  description?: string
  attributes?: Array<{ trait_type: string; value: string | number }>
}

export function NFTViewer({
  tokenUri,
  onClose,
}: {
  tokenUri: string
  onClose: () => void
}) {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetadata() {
      try {
        setLoading(true)
        const response = await fetch(tokenUri)
        const data = await response.json()
        setMetadata(data)
      } catch (error) {
        console.error('Error fetching NFT metadata:', error)
      } finally {
        setLoading(false)
      }
    }

    if (tokenUri) {
      fetchMetadata()
    }
  }, [tokenUri])

  if (!tokenUri) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 font-mono">
      <div className="bg-[#000000] border border-[#49c5b6] rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {metadata?.name || 'Loading...'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#49c5b6] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-white">Loading...</div>
        ) : (
          <>
            {metadata?.image && (
              <div className="mb-4">
                <img
                  src={metadata.image}
                  alt={metadata.name}
                  className="w-full rounded-lg border border-[#49c5b6]"
                />
              </div>
            )}

            {metadata?.description && (
              <p className="text-gray-400 mb-4">{metadata.description}</p>
            )}

            {metadata?.attributes && (
              <div className="grid grid-cols-2 gap-2">
                {metadata.attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="bg-black border border-[#49c5b6] p-2 rounded"
                  >
                    <div className="text-sm text-gray-400">
                      {attr.trait_type}
                    </div>
                    <div className="font-medium text-white">{attr.value}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
