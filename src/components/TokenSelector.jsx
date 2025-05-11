// components/TokenSelector.jsx
export default function TokenSelector({ tokens, selected, onSelect }) {
    return (
      <div className="bg-[#101422] rounded-xl overflow-hidden divide-y divide-gray-700 shadow-lg">
        {tokens.map((token) => (
          <button
            key={token.symbol}
            onClick={() => token.active && onSelect(token.symbol)}
            className={`
              w-full text-left px-4 py-3 flex items-center gap-2 
              ${selected === token.symbol ? "bg-[#1a1f2e]" : ""}
              ${token.active ? "hover:bg-[#2a2f40] cursor-pointer" : "opacity-50 cursor-not-allowed"}
            `}
          >
            <span>{token.icon}</span>
            <span>{token.symbol}</span>
            {!token.active && <span className="ml-auto text-sm text-yellow-400">Coming soon</span>}
          </button>
        ))}
      </div>
    );
  }
  