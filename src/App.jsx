import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ethers } from "ethers";
import Navbar from "./components/Navbar/navbar";
import Swap from "./pages/Swap";
import erc20 from "./contracts/erc20.json";

const swanAddress = "0x58dc9E6B82fAAfbABd515af2B00dba57dc1ddb07"; // updated SWAN token address

function App() {
  const [wallet, setWallet] = useState("");
  const [sttBalance, setSttBalance] = useState("0"); // native token balance
  const [swanBalance, setSwanBalance] = useState("0");

  async function connectWallet() {
    if (!window.ethereum) return alert("Metamask is required");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setWallet(address);
    await getBalances(address);
  }

  async function getBalances(address) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const nativeBal = await provider.getBalance(address);
    const swan = new ethers.Contract(swanAddress, erc20, provider);
    const swanBal = await swan.balanceOf(address);

    setSttBalance(ethers.formatEther(nativeBal));
    setSwanBalance(ethers.formatUnits(swanBal, 18));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1125] via-[#090d1f] to-[#0f1125] text-white">
      <Navbar wallet={wallet} connectWallet={connectWallet} />
      <Routes>
        <Route path="/" element={<Navigate to="/swap" replace />} />
        <Route path="/swap" element={
          <Swap
            wallet={wallet}
            connectWallet={connectWallet}
            sttBalance={sttBalance}
            swanBalance={swanBalance}
            getBalances={getBalances}
          />
        } />
      </Routes>
    </div>
  );
}

export default App;
