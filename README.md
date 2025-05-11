# 🦢 SwanSwap – Swap, Spin & Win on Web3

SwanSwap is a decentralized Web3 platform combining token swapping, a spin-to-win wheel game, Discord-based token airdrops, and a premium feature system powered by Solana and Firebase.

## 🚀 Features

### 🔄 Swap Platform
- Supports Solana and Ethereum tokens
- Phantom & MetaMask wallet integration
- Real-time token balance and price display
- Swap UI inspired by Jupiter Exchange

### 💬 Real-Time Chat (Basic & Premium)
- Firebase-powered real-time messaging
- Basic Plan: 3-message daily limit
- Premium Plan: Unlimited + Wallet Tools + NFT Staking

### 📊 Premium Plan Logic
- Pay via Solana Pay
- Unlock advanced features like:
  - Limit Orders & DCA
  - Wallet Portfolio & Transaction History
  - NFT Staking Mechanism

### 🎁 Discord Airdrop Bot
- Users submit wallets in Discord
- Bot sends SWAN tokens once per day per wallet/user
- Prevents spam and abuse via Firebase tracking

---

## 🔧 Tech Stack

- **Frontend**: React (JSX), Tailwind CSS
- **Blockchain**: Solana + Ethereum (EVM)
- **Smart Contracts**: Solana Program Library + Solidity
- **Wallets**: Phantom, MetaMask
- **Backend**: Firebase (Realtime DB, Auth)
- **Bot**: Discord.js + Web3.js + Firebase

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/your-org/swanswap.git
cd swanswap

# Install dependencies
npm install

# Start the dev server
npm run dev
