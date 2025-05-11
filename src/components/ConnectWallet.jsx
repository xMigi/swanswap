import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function ConnectWallet({ onConnected }) {
  const [walletAddress, setWalletAddress] = useState("");

  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      onConnected(accounts[0]);
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", connectWallet);
    }
  }, []);

  return (
    <button
      onClick={connectWallet}
      className="bg-purple-600 text-white px-4 py-2 rounded"
    >
      {walletAddress ? walletAddress.slice(0, 6) + "..." : "Connect Wallet"}
    </button>
  );
}
