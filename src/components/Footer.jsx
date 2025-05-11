import React from "react";
import leapLogo from "../assets/leap.jpg";

const Footer = () => {
  return (
    <footer className="w-full flex justify-center items-center gap-3 py-4 mt-10 bg-transparent">
      <img src={leapLogo} alt="Leap Wallet" className="w-7 h-7 rounded-full" />
      <span className="text-sm text-gray-300 font-medium">Supported by Leap Wallet</span>
    </footer>
  );
};

export default Footer;
