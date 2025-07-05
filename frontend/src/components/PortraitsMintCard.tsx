'use client'

import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { web3config } from '@/dapp.config'
import {
  blonksAbi,
  useReadBlonksHasAddressMinted,
  useReadBlonksTotalSupply,
  useReadBlonksMaxSupply,
} from '@/contracts-generated'
import { parseEther } from 'viem'

export function PortraitsMintCard() {
  const { address } = useAccount()
  const { data: hash, isPending, writeContract } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  // Check if user has already minted
  const { data: hasAlreadyMinted, isLoading: isCheckingMint } =
    useReadBlonksHasAddressMinted({
      address: web3config.contractAddress,
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    })

  // Get total supply and max supply for progress
  const { data: totalSupply } = useReadBlonksTotalSupply({
    address: web3config.contractAddress,
  })
  const { data: maxSupply } = useReadBlonksMaxSupply({
    address: web3config.contractAddress,
  })

  const handleMint = async () => {
    if (!address || hasAlreadyMinted) return

    writeContract({
      address: web3config.contractAddress,
      abi: blonksAbi,
      functionName: 'mint',
      value: parseEther('0.01'), // 0.01 ETH mint price
    })
  }

  // Calculate minting progress
  const progress =
    totalSupply && maxSupply
      ? (Number(totalSupply) / Number(maxSupply)) * 100
      : 0

  const getMintButtonText = () => {
    if (!address) return 'Connect Wallet to Mint'
    if (isCheckingMint) return 'Checking...'
    if (hasAlreadyMinted) return 'Already Minted'
    if (isPending) return 'Confirming...'
    if (isConfirming) return 'Minting...'
    if (isConfirmed) return 'Minted!'
    return 'Mint Portrait (0.01 ETH)'
  }

  const getMintButtonDisabled = () => {
    return (
      !address ||
      hasAlreadyMinted ||
      isPending ||
      isConfirming ||
      isCheckingMint
    )
  }

  return (
    <div className="flex flex-col p-8 border border-[#49c5b6] rounded-lg bg-black space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-[#49c5b6]">
          Mint Your Temporal ASCII Portrait
        </h2>
        <p className="text-gray-400 mb-6">
          Each portrait is unique to your wallet address and evolves over time
          based on block numbers. Limited to one per wallet.
        </p>
      </div>

      {/* Minting Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Minted</span>
          <span className="text-white">
            {totalSupply?.toString() || '0'} /{' '}
            {maxSupply?.toString() || '10000'}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-[#49c5b6] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Status Messages */}
      {address && hasAlreadyMinted && (
        <div className="p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
          <p className="text-yellow-400 text-center">
            ✅ You have already minted your portrait! Check your inventory to
            view it.
          </p>
        </div>
      )}

      {isConfirmed && (
        <div className="p-4 bg-green-900/20 border border-green-600 rounded-lg">
          <p className="text-green-400 text-center">
            🎉 Portrait minted successfully! Your unique ASCII art is ready.
          </p>
        </div>
      )}

      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={getMintButtonDisabled()}
        className={`w-full py-4 rounded-lg font-bold transition-all duration-200 ${
          getMintButtonDisabled()
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-[#49c5b6] text-black hover:bg-[#3ba697] active:scale-95'
        }`}
      >
        {getMintButtonText()}
      </button>

      {/* Info */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>• One mint per wallet address</p>
        <p>• Portrait evolves every 100 blocks</p>
        <p>• Unique ASCII art based on your address</p>
      </div>
    </div>
  )
}
