import { defineConfig } from '@wagmi/cli'
import { foundry, react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/contracts-generated.ts',
  plugins: [
    foundry({
      project: '../contracts',
      artifacts: 'out',
      include: ['Gatherers.json', 'Portraits.json'],
    }),
    react(),
  ],
})
