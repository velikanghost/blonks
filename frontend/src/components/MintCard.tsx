'use client'

import { useAccount } from 'wagmi'
import {
  useWriteGatherersMint,
  useReadGatherersTotalSupply,
  useReadGatherersMaxSupply,
} from '../contracts-generated'
import { useState } from 'react'
import { web3config } from '../dapp.config'
import { useWaitForTransactionReceipt } from 'wagmi'
import toast from 'react-hot-toast'

export function MintCard() {
  const { address } = useAccount()
  const {
    data: writeData,
    isPending,
    writeContract: mint,
  } = useWriteGatherersMint()
  const [quantity, setQuantity] = useState(1)

  // Read contract data
  const { data: totalSupply } = useReadGatherersTotalSupply()
  const { data: maxSupply } = useReadGatherersMaxSupply()

  // Transaction receipt tracking
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: writeData,
    })

  const handleMint = async () => {
    if (!address) return // Not connected

    try {
      const toastId = toast.loading('Preparing to mint...')

      await mint({
        address: web3config.contractAddress as `0x${string}`,
      })

      // Update loading toast while waiting for confirmation
      toast.loading('Waiting for transaction confirmation...', { id: toastId })

      // Watch for confirmation success/failure
      if (isConfirmed) {
        toast.success('Successfully minted your Gatherer!', { id: toastId })
      }
    } catch (error) {
      toast.error('Failed to mint: ' + (error as Error).message)
    }
  }

  const updateQuantity = (delta: number) => {
    setQuantity((prev) => Math.min(Math.max(1, prev + delta), 5))
  }

  const PRICE_PER_NFT = 0.001
  const totalCost = (PRICE_PER_NFT * quantity).toFixed(3)

  // Calculate percentage minted
  const percentageMinted =
    totalSupply && maxSupply
      ? (Number(totalSupply) / Number(maxSupply)) * 100
      : 0
  const formattedPercentage = percentageMinted.toFixed(2)

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-[#000000] p-8 rounded-lg border border-[#49c5b6]">
        <h1 className="text-4xl font-bold mb-2">Mint Your Gatherer</h1>
        <p className="text-gray-400 mb-8">
          Join the Gatherers collection on Monad
        </p>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Minted</span>
            <span>
              {totalSupply?.toString() ?? '...'} /{' '}
              {maxSupply?.toString() ?? '...'}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#49c5b6] transition-all duration-500"
              style={{ width: `${percentageMinted}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">Quantity</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => updateQuantity(-1)}
                disabled={quantity <= 1 || isPending || isConfirming}
                className="w-8 h-8 flex items-center justify-center border border-[#49c5b6] rounded hover:bg-[#49c5b6] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => updateQuantity(1)}
                disabled={quantity >= 5 || isPending || isConfirming}
                className="w-8 h-8 flex items-center justify-center border border-[#49c5b6] rounded hover:bg-[#49c5b6] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Price per NFT</span>
            <span>{PRICE_PER_NFT} MONAD</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">Total Cost</span>
            <span>{totalCost} MONAD</span>
          </div>
          <p className="text-sm text-gray-400">
            Max 5 per wallet • Gas fees not included
          </p>
        </div>

        <button
          onClick={handleMint}
          disabled={!address || isPending || isConfirming}
          className="w-full py-4 bg-[#49c5b6] text-black rounded-lg font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {!address
            ? 'Connect Wallet to Mint'
            : isPending
              ? 'Preparing Transaction...'
              : isConfirming
                ? 'Minting...'
                : 'Mint Now'}
        </button>

        <div className="flex justify-center gap-8 mt-6">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#49c5b6] hover:underline"
          >
            View Collection
          </a>
          <a
            href={`https://explorer.monad.xyz/address/${web3config.contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#49c5b6] hover:underline"
          >
            View Contract
          </a>
        </div>
      </div>

      <div className="bg-[#000000] p-8 rounded-lg border border-[#49c5b6]">
        <h2 className="text-2xl font-bold mb-4">Mint Information</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Contract Address</span>
            <span className="text-[#49c5b6]">{web3config.contractAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Token Standard</span>
            <span>ERC-721</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Blockchain</span>
            <span>Monad</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Mint Status</span>
            <span className="px-3 py-1 bg-[#49c5b6] text-black rounded-full text-sm">
              Live
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
