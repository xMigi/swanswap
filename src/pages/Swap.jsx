// Swap.jsx - Fully mobile responsive version

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import swapABI from "../contracts/swapABI.json";
import erc20 from "../contracts/erc20.json";
import { FaArrowDown } from "react-icons/fa";
import Footer from "../components/Footer";
import swanLogo from "../assets/swan.png";

const swapAddress = "0x29FdFd65626711aE2dd738BA8985d7e24A7c0F27";
const swanAddress = "0x58dc9E6B82fAAfbABd515af2B00dba57dc1ddb07";
const conversionRate = 10000;

const TOKENS = [
  { symbol: "STT", icon: "⚡", active: true },
  {
    symbol: "SWAN",
    icon: <img src={swanLogo} alt="SWAN" style={{ width: 20, height: 20, borderRadius: "50%" }} />,
    active: true,
  },
  { symbol: "SWAN/USDT", icon: "💵", active: false },
  { symbol: "SWAN/USDC", icon: "💲", active: false },
];

export default function SwanSwap({ wallet, connectWallet, sttBalance, swanBalance, getBalances }) {
  const [fromToken, setFromToken] = useState("STT");
  const [toToken, setToToken] = useState("SWAN");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [selecting, setSelecting] = useState(false);
  const [walletBalances, setWalletBalances] = useState({ STT: 0, SWAN: 0 });
  const [contractBalances, setContractBalances] = useState({ STT: "0.00", SWAN: "0.00" });

  useEffect(() => {
    async function getSwapContractBalances() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const nativeBalance = await provider.getBalance(swapAddress);
      const swan = new ethers.Contract(swanAddress, erc20, provider);
      const swanBalance = await swan.balanceOf(swapAddress);

      setContractBalances({
        STT: ethers.formatEther(nativeBalance),
        SWAN: ethers.formatEther(swanBalance),
      });
    }

    getSwapContractBalances();

    setWalletBalances({
      STT: sttBalance,
      SWAN: swanBalance,
    });
  }, [sttBalance, swanBalance]);

  const handleSwitch = () => {
    if (fromToken !== toToken) {
      const temp = fromToken;
      setFromToken(toToken);
      setToToken(temp);
      setAmount("");
    }
  };

  const handleTokenSelect = (symbol) => {
    setFromToken(symbol);
    setToToken(symbol === "STT" ? "SWAN" : "STT");
    setSelecting(false);
  };

  const performSwap = async () => {
    if (!wallet) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (fromToken === "STT") {
        const contract = new ethers.Contract(swapAddress, swapABI, signer);
        const tx = await contract.swapNativeToSwan({
          value: ethers.parseEther(amount),
        });
        setStatus("Swap submitted...");
        await tx.wait();
        setStatus("Swap successful!");
      } else {
        const swan = new ethers.Contract(swanAddress, erc20, signer);
        const amountWei = ethers.parseEther(amount);
        const approveTx = await swan.approve(swapAddress, amountWei);
        await approveTx.wait();

        const contract = new ethers.Contract(swapAddress, swapABI, signer);
        const tx = await contract.swapSwanToNative(amountWei);
        setStatus("Swap submitted...");
        await tx.wait();
        setStatus("Swap successful!");
      }

      getBalances(wallet);
    } catch (err) {
      console.error("Swap error:", err);

      if (err?.code === 4001 || err?.message?.toLowerCase().includes("user denied")) {
        setStatus("❌ Transaction rejected by user.");
        return;
      }

      const errorMessage =
        err?.revert?.args?.[0] ||
        err?.info?.error?.message ||
        err?.message ||
        "Unknown error";

      if (errorMessage.includes("Daily limit")) {
        setStatus("🚫 Daily swap limit reached (max 1 STT per day). Please try again tomorrow.");
      } else if (errorMessage.includes("Not enough SWAN")) {
        setStatus("⚠️ Swap failed: Not enough SWAN in the contract.");
      } else if (errorMessage.includes("Not enough STT")) {
        setStatus("⚠️ Swap failed: Not enough STT in the contract.");
      } else {
        setStatus(`Swap failed: ${errorMessage}`);
      }
    }
  };

  const getEstimatedOutput = () => {
    if (!amount || isNaN(amount)) return "0.00";
    return fromToken === "STT"
      ? (parseFloat(amount) * conversionRate * 0.95).toFixed(2)
      : (parseFloat(amount) / conversionRate).toFixed(5);
  };

  return (
    <div className="min-h-screen bg-[#0e0f1a] text-white flex flex-col items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-purple-600">
          Swan<span className="text-white">Swap</span>
        </h1>

        {!wallet && (
          <div className="bg-yellow-500/10 text-yellow-300 p-3 sm:p-4 rounded-xl text-center text-sm font-medium">
            Wallet not connected.
          </div>
        )}

        {/* SELLING BOX */}
        <div className="bg-[#1a1e2d] rounded-xl p-4 shadow-md space-y-3">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>Selling</span>
            <div className="flex items-center gap-2">
              <span>👛</span>
              <span className="text-white font-semibold">
                {parseFloat(walletBalances[fromToken] || 0).toFixed(2)} {fromToken}
              </span>
            </div>
          </div>

          <div className="bg-[#101422] px-4 py-3 rounded-lg flex items-center justify-between">
            <div
              onClick={() => setSelecting(true)}
              className="flex items-center gap-2 text-lg sm:text-xl font-medium text-white cursor-pointer"
            >
              {TOKENS.find((t) => t.symbol === fromToken)?.icon} {fromToken}
              <span className="text-gray-400 text-lg">⌄</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent text-2xl sm:text-3xl font-semibold text-right text-white w-1/2 outline-none placeholder-gray-500"
            />
          </div>

          {selecting && (
            <div className="mt-2 bg-[#1a1e2d] border border-gray-700 rounded-lg shadow-lg p-2 z-50">
              {TOKENS.map((token) => (
                <div
                  key={token.symbol}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                    token.active ? "hover:bg-[#2b354d]" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => token.active && handleTokenSelect(token.symbol)}
                >
                  <div className="flex items-center gap-2 text-white text-lg">
                    {token.icon} {token.symbol}
                  </div>
                  {!token.active && <span className="text-xs text-gray-400">Coming soon</span>}
                </div>
              ))}
            </div>
          )}

          <div className="text-right mt-1">
            <button
              onClick={() => setAmount(walletBalances[fromToken])}
              className="text-xs text-blue-400 hover:text-blue-300 transition"
            >
              MAX
            </button>
          </div>
        </div>

        {/* SWITCH ICON */}
        <div className="flex justify-center">
          <button onClick={handleSwitch} className="bg-[#1f2937] hover:bg-[#2c384c] p-2 rounded-full transition">
            <FaArrowDown className="text-white text-xl" />
          </button>
        </div>

        {/* BUYING BOX */}
        <div className="bg-[#1a1e2d] rounded-xl p-4 shadow-md space-y-3">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>Buying</span>
            <div className="flex items-center gap-2">
              <span>👛</span>
              <span className="text-white font-semibold">
                {parseFloat(walletBalances[toToken] || 0).toFixed(2)} {toToken}
              </span>
            </div>
          </div>

          <div className="bg-[#101422] px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg sm:text-xl font-medium text-white">
              {TOKENS.find((t) => t.symbol === toToken)?.icon} {toToken}
            </div>
            <div className="text-2xl sm:text-3xl font-semibold text-white text-right w-1/2">
              ≈ {getEstimatedOutput()}
            </div>
          </div>
        </div>

        <button
          onClick={wallet ? performSwap : connectWallet}
          disabled={!wallet || !amount}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            wallet && amount
              ? "bg-green-500 hover:bg-green-600 text-black"
              : "bg-[#2f3545] text-white cursor-not-allowed"
          }`}
        >
          {wallet ? (amount ? "Swap" : "Enter amount") : "Connect Wallet"}
        </button>

        {status && <p className="text-center text-yellow-400 text-sm">{status}</p>}
      </div>

      <Footer />
    </div>
  );
}
