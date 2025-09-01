import { useState, useEffect, useCallback } from 'react'
import { indexerService, GalleryNFT } from '@/services/indexer'

export function useGalleryData() {
  const [allNfts, setAllNfts] = useState<GalleryNFT[]>([])
  const [displayedNfts, setDisplayedNfts] = useState<GalleryNFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const pageSize = 50

  const loadGalleryData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await indexerService.getGalleryData()
      setAllNfts(data)
      setLastUpdated(new Date())

      // Set initial page
      const initialPage = data.slice(0, pageSize)
      setDisplayedNfts(initialPage)
      setCurrentPage(1)
      setHasMore(data.length > pageSize)
    } catch (err) {
      console.error('Failed to load gallery data:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to load gallery data',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadNextPage = useCallback(() => {
    const nextPageStart = currentPage * pageSize
    const nextPageEnd = nextPageStart + pageSize
    const nextPage = allNfts.slice(nextPageStart, nextPageEnd)

    setDisplayedNfts((prev) => [...prev, ...nextPage])
    setCurrentPage((prev) => prev + 1)
    setHasMore(nextPageEnd < allNfts.length)
  }, [currentPage, allNfts])

  const refreshGallery = useCallback(() => {
    loadGalleryData()
  }, [loadGalleryData])

  useEffect(() => {
    loadGalleryData()
  }, [loadGalleryData])

  return {
    nfts: displayedNfts,
    allNfts,
    isLoading,
    error,
    lastUpdated,
    refreshGallery,
    loadNextPage,
    hasMore,
    totalSupply: allNfts.length,
    currentPage,
  }
}
