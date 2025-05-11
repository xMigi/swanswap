import { Link, useLocation } from "react-router-dom";

export default function Menu() {
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path
      ? "text-purple-500 font-semibold"
      : "text-gray-300 hover:text-purple-400 transition";  

  return (
    <div className="flex justify-center gap-8 text-base">
      <Link to="/swap" className={isActive("/swap")}>Swap</Link>

      {/* Stake - Coming Soon */}
      <div
        className="text-white-400 opacity-60 relative group cursor-not-allowed"
        title="Coming soon"
      >
        Stake
        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs bg-purple-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
          Coming soon
        </span>
      </div>

      {/* NFT - Coming Soon */}
      <div
        className="text-white-400 opacity-60 relative group cursor-not-allowed"
        title="Coming soon"
      >
        NFT
        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs bg-purple-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
          Coming soon
        </span>
      </div>
    </div>
  );
}
