export default function Wallet({ wallet, connectWallet }) {
  const shortAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className="flex justify-end">
      {wallet ? (
        <div className="bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-sm font-mono">
          {shortAddress(wallet)}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded transition"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
