import { NFTGallery } from '@/components/NFTViewer'
import Navbar from '@/components/Navbar'

export default function Gallery() {
  return (
    <main className="min-h-screen bg-[#000000] text-white font-mono">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#49c5b6]">
            Portrait Gallery
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore all minted Temporal ASCII Portraits. Each piece is unique
            and evolves over time, creating a living collection of on-chain art.
          </p>
        </div>

        <NFTGallery />
      </div>
    </main>
  )
}
