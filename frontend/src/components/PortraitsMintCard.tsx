'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { web3config } from '@/dapp.config'
import { portraitsAbi } from '@/contracts-generated'
import { parseEther } from 'viem'

export function PortraitsMintCard() {
  const { data: hash, isPending, writeContract } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const handleMint = async () => {
    writeContract({
      address: web3config.contractAddress,
      abi: portraitsAbi,
      functionName: 'mint',
      value: parseEther('0.01'), // 0.01 ETH mint price
    })
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 border border-[#49c5b6] rounded-lg bg-black">
      <h2 className="text-2xl font-bold mb-4 text-[#49c5b6]">
        Mint a Temporal ASCII Portrait
      </h2>
      <p className="text-gray-400 mb-6 text-center">
        Each portrait is unique to your wallet address and evolves over time
        based on block numbers.
      </p>
      <button
        onClick={handleMint}
        disabled={isPending || isConfirming}
        className="px-6 py-2 bg-[#49c5b6] text-black rounded hover:bg-[#3ba697] transition-colors disabled:bg-gray-600"
      >
        {isPending
          ? 'Confirming...'
          : isConfirming
            ? 'Minting...'
            : isConfirmed
              ? 'Minted!'
              : 'Mint (0.01 ETH)'}
      </button>
    </div>
  )
}
