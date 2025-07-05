import '@rainbow-me/rainbowkit/styles.css'
import { darkTheme, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { monadTestnet } from 'viem/chains'

export const config = getDefaultConfig({
  appName: 'Gatherers',
  projectId: '2f999af39372f2109a5b750f9a87709f',
  chains: [monadTestnet],
  ssr: true, // Enable server-side rendering mode
})

export const myRainbowTheme = darkTheme({
  accentColor: '#C2410C',
  accentColorForeground: 'white',
  borderRadius: 'large',
})
