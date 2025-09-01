import { useState, useEffect, useCallback } from 'react'
import { indexerService, GalleryNFT } from '@/services/indexer'

export function useGalleryData() {
  const [nfts, setNfts] = useState<GalleryNFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadGalleryData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await indexerService.getGalleryData()
      setNfts(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to load gallery data:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to load gallery data',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshGallery = useCallback(() => {
    loadGalleryData()
  }, [loadGalleryData])

  useEffect(() => {
    loadGalleryData()
  }, [loadGalleryData])

  return {
    nfts,
    isLoading,
    error,
    lastUpdated,
    refreshGallery,
    totalSupply: nfts.length,
  }
}
