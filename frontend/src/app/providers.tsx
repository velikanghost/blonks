'use client'

import React, { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

import { config, myRainbowTheme } from '../wagmi'
import { ProgressProvider } from '@bprogress/next/app'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={myRainbowTheme}>
          <ProgressProvider
            height="4px"
            color="#fffd00"
            options={{ showSpinner: false }}
            shallowRouting
          >
            {children}
          </ProgressProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
