# Blonks - Evolving ASCII Portrait NFTs

An on-chain generative art project that creates unique ASCII portraits that evolve over time based on block numbers. Each portrait is deterministically generated from the minter's wallet address and includes dynamic backgrounds, special traits, and temporal variations.

## Features

- 🎨 Fully on-chain SVG generation
- 🔄 Evolving portraits that change every 100 blocks
- 🎯 One mint per wallet
- 💎 Special rare traits (Diamond Frame, Golden Glow)
- 🌈 Dynamic backgrounds and color schemes
- ⚡ Built with Foundry and Next.js

## Technical Stack

- **Smart Contracts**: Solidity + Foundry
- **Frontend**: Next.js + Wagmi + Tailwind CSS
- **Web3**: Viem

## Portrait Generation Example

Here's a snippet of how the ASCII portraits are generated:

```solidity
function _getFaceIntensity(
    uint256 x,
    uint256 y,
    bytes32 seed,
    uint256 variation
) internal pure returns (uint256) {
    // Create a basic face structure
    uint256 centerX = 12;
    uint256 centerY = 10;

    // Calculate distance from center
    uint256 distX = x > centerX ? x - centerX : centerX - x;
    uint256 distY = y > centerY ? y - centerY : centerY - y;

    // Face outline (oval)
    uint256 faceIntensity = 0;
    if (distX <= 8 && distY <= 8) {
        uint256 ovalDist = (distX * distX * 64) + (distY * distY * 100);
        if (ovalDist <= 4096) {
            // Inside face
            faceIntensity = 80;
        }
    }

    // Eyes
    if (y >= 6 && y <= 8) {
        if ((x >= 8 && x <= 10) || (x >= 14 && x <= 16)) {
            faceIntensity = 200 + (variation * 10);
        }
    }

    // Nose
    if (y >= 10 && y <= 12 && x >= 11 && x <= 13) {
        faceIntensity = 120 + (variation * 8);
    }

    // Mouth
    if (y >= 14 && y <= 15 && x >= 10 && x <= 14) {
        faceIntensity = 150 + (variation * 12);
    }

    // Add some randomness for texture
    uint256 noise = _random(seed, x * 25 + y * 25 + variation);
    faceIntensity += (noise % 40);

    return faceIntensity > 255 ? 255 : faceIntensity;
}
```

## Smart Contract Details

- **Max Supply**: 500 NFTs
- **Mint Price**: 0.1 MON
- **Evolution Rate**: Every 100 blocks
- **Rarity System**: Time-based variations and special traits

## Development Guidelines

### Smart Contracts

- Uses Foundry framework for development and testing
- Implements OpenZeppelin's AccessControl
- Uses ReentrancyGuard for all external functions
- Applies SafeERC20 for token interactions
- Uses custom errors instead of string-based reverts
- Implements checks-effects-interactions pattern

### Frontend

- Modern React components with Wagmi hooks
- Responsive design with Tailwind CSS
- Real-time evolution tracking
- Wallet integration and transaction handling

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/velikanghost/blonks
cd blonks
```

2. Install dependencies:

```bash
# Install Foundry dependencies
forge install

# Install frontend dependencies
cd frontend
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Add your environment variables
```

4. Run the development server:

```bash
# In the frontend directory
npm run dev
```

## Security

- ReentrancyGuard implementation
- Access control mechanisms
- Secure randomness generation
- Proper input validation

## License

MIT
