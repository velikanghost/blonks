export const web3config = {
  contractAddress: '0xb6A14FCcd38A518f389644253Feb2e9B22C9d971',
  chainId: 10143,
  chainName: 'Monad Testnet',
  chainRpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
  chainExplorerUrl: 'https://testnet.monadexplorer.com/',
  // Add indexer configuration
  indexerApiUrl:
    process.env.NEXT_PUBLIC_INDEXER_API_URL || 'https://your-indexer-api.com',
} as const
