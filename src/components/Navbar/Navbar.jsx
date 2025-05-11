import Logo from "./Logo";
import Menu from "./Menu";
import Wallet from "./Wallet";

import swanIcon from "../../assets/swan.png";
import twitterLogo from "../../assets/twitter.svg";
import discordLogo from "../../assets/discord.svg";

export default function Navbar({ wallet, connectWallet }) {
  return (
    <nav className="bg-[#1a1b22] shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <img src={swanIcon} alt="Swan Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
            <Logo />
          </div>
          <div className="sm:hidden flex gap-2">
            <Wallet wallet={wallet} connectWallet={connectWallet} />
          </div>
        </div>

        {/* Menu */}
        <div className="hidden sm:flex">
          <Menu />
        </div>

        {/* Right: Social + Wallet */}
        <div className="flex items-center justify-end gap-4 sm:gap-6">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src={twitterLogo} alt="Twitter" className="w-6 h-6 invert brightness-200" />
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
            <img src={discordLogo} alt="Discord" className="w-6 h-6 invert brightness-200" />
          </a>
          <div className="hidden sm:flex">
            <Wallet wallet={wallet} connectWallet={connectWallet} />
          </div>
        </div>
      </div>
    </nav>
  );
}
