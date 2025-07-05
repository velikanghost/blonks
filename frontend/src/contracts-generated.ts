import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Portraits
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const portraitsAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_SUPPLY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MINT_PRICE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'hasAddressMinted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'hasMinted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'originalMinter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  { type: 'error', inputs: [], name: 'ERC721EnumerableForbiddenBatchMint' },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
  {
    type: 'error',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721OutOfBoundsIndex',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__
 */
export const useReadPortraits = /*#__PURE__*/ createUseReadContract({
  abi: portraitsAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"MAX_SUPPLY"`
 */
export const useReadPortraitsMaxSupply = /*#__PURE__*/ createUseReadContract({
  abi: portraitsAbi,
  functionName: 'MAX_SUPPLY',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"MINT_PRICE"`
 */
export const useReadPortraitsMintPrice = /*#__PURE__*/ createUseReadContract({
  abi: portraitsAbi,
  functionName: 'MINT_PRICE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadPortraitsBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: portraitsAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadPortraitsGetApproved = /*#__PURE__*/ createUseReadContract({
  abi: portraitsAbi,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"hasAddressMinted"`
 */
export const useReadPortraitsHasAddressMinted =
  /*#__PURE__*/ createUseReadContract({
    abi: portraitsAbi,
    functionName: 'hasAddressMinted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"hasMinted"`
 */
export const useReadPortraitsHasMinted = /*#__PURE__*/ createUseReadContract({
  abi: portraitsAbi,
  functionName: 'hasMinted',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadPortraitsIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: portraitsAbi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"name"`
 */
export const useReadPortraitsName = /*#__PURE__*/ createUseReadContract({
  abi: portraitsAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"originalMinter"`
 */
export const useReadPortraitsOriginalMinter =
  /*#__PURE__*/ createUseReadContract({
    abi: portraitsAbi,
    functionName: 'originalMinter',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"owner"`
 */
export const useReadPortraitsOwner = /*#__PURE__*/ createUseReadContract({
  abi: portraitsAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadPortraitsOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: portraitsAbi,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadPortraitsSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: portraitsAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadPortraitsSymbol = /*#__PURE__*/ createUseReadContract({
  abi: portraitsAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"tokenByIndex"`
 */
export const useReadPortraitsTokenByIndex = /*#__PURE__*/ createUseReadContract(
  { abi: portraitsAbi, functionName: 'tokenByIndex' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"tokenOfOwnerByIndex"`
 */
export const useReadPortraitsTokenOfOwnerByIndex =
  /*#__PURE__*/ createUseReadContract({
    abi: portraitsAbi,
    functionName: 'tokenOfOwnerByIndex',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadPortraitsTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: portraitsAbi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadPortraitsTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: portraitsAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portraitsAbi}__
 */
export const useWritePortraits = /*#__PURE__*/ createUseWriteContract({
  abi: portraitsAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"approve"`
 */
export const useWritePortraitsApprove = /*#__PURE__*/ createUseWriteContract({
  abi: portraitsAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"mint"`
 */
export const useWritePortraitsMint = /*#__PURE__*/ createUseWriteContract({
  abi: portraitsAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWritePortraitsRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: portraitsAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWritePortraitsSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: portraitsAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWritePortraitsSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: portraitsAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWritePortraitsTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: portraitsAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWritePortraitsTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: portraitsAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWritePortraitsWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: portraitsAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portraitsAbi}__
 */
export const useSimulatePortraits = /*#__PURE__*/ createUseSimulateContract({
  abi: portraitsAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulatePortraitsApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portraitsAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulatePortraitsMint = /*#__PURE__*/ createUseSimulateContract(
  { abi: portraitsAbi, functionName: 'mint' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulatePortraitsRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portraitsAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulatePortraitsSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portraitsAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulatePortraitsSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portraitsAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulatePortraitsTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portraitsAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulatePortraitsTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portraitsAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portraitsAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulatePortraitsWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portraitsAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portraitsAbi}__
 */
export const useWatchPortraitsEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: portraitsAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portraitsAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchPortraitsApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portraitsAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portraitsAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchPortraitsApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portraitsAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portraitsAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchPortraitsOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portraitsAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portraitsAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchPortraitsTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portraitsAbi,
    eventName: 'Transfer',
  })
