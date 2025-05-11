import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import wheelABI from "../contracts/wheelABI.json";

const wheelAddress = "0x1CABBf3a037c57adfDD4FC28C97726FcF3B9D5F2";

const rewards = [
  { label: "10 SWAN", id: 1 },
  { label: "Try Again", id: 0 },
  { label: "10 SWAN", id: 1 },
  { label: "100 SWAN", id: 2 },
  { label: "Try Again", id: 0 },
  { label: "10 SWAN", id: 1 },
  { label: "0.1 STT", id: 3 },
  { label: "10 SWAN", id: 1 },
  { label: "Try Again", id: 0 },
  { label: "500 SWAN", id: 4 },
  { label: "Try Again", id: 0 },
  { label: "10 SWAN", id: 1 }
];

const segmentCount = rewards.length;
const canvasSize = 500;
const segmentAngle = 360 / segmentCount;

export default function Wheel({ wallet }) {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    drawWheel();
  }, [angle]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    const center = canvasSize / 2;
    const radius = center - 10;
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((angle * Math.PI) / 180);

    for (let i = 0; i < segmentCount; i++) {
      const start = (i * segmentAngle * Math.PI) / 180;
      const end = ((i + 1) * segmentAngle * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.fillStyle = i % 2 === 0 ? "#2b2b2b" : "#1f1f1f";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.save();
      ctx.rotate(start + segmentAngle * Math.PI / 360);
      ctx.translate(radius * 0.65, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(rewards[i].label, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  };

  const spinWheel = async () => {
    if (spinning || !wallet) return;
    setSpinning(true);
    setErrorMessage("");
    setSuccessMessage("");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(wheelAddress, wheelABI, signer);

    try {
      contract.once("RewardGiven", (user, label, amount, isSTT) => {
        const rewardIndex = rewards.findIndex(r => r.label === label);
        startAnimation(rewardIndex, { label });
      });

      const tx = await contract.spin(0, { value: ethers.parseEther("0.05") });
      await tx.wait();
    } catch (err) {
      console.error("Spin transaction failed", err);
      if (err?.reason?.includes("Daily limit reached")) {
        setErrorMessage("You have used all 3 spins today. Please come back tomorrow!");
      } else {
        setErrorMessage("Transaction failed. Please try again.");
      }
      setSpinning(false);
    }
  };

  const startAnimation = (rewardIndex, reward) => {
    const spinCount = 5;
    const degrees = 360 * spinCount + (360 - rewardIndex * segmentAngle - segmentAngle / 2);
    let start = angle;
    let end = start + degrees;
    let duration = 3000;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percent = Math.min(progress / duration, 1);
      const ease = 1 - Math.pow(1 - percent, 3);
      const current = start + (end - start) * ease;
      setAngle(current % 360);

      if (percent < 1) {
        requestAnimationFrame(animate);
      } else {
        setResult(reward.label);
        setSpinning(false);
        if (reward.label !== "Try Again") {
          setSuccessMessage(`🎉 You won ${reward.label}! 🎉`);
        } else {
          setSuccessMessage("");
        }
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div>
      <h2>🎡 Canvas Wheel</h2>
      <div style={{ position: "relative", width: canvasSize, height: canvasSize }}>
        <canvas ref={canvasRef} width={canvasSize} height={canvasSize} style={{ borderRadius: "50%" }} />
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%) rotate(180deg)",
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderBottom: "18px solid red",
            zIndex: 10,
          }}
        ></div>
      </div>
      <button
        onClick={spinWheel}
        disabled={!wallet || spinning}
        className="spin-btn"
        style={{ marginTop: "1rem", backgroundColor: wallet ? "#9333ea" : "#555", color: "white", padding: "0.75rem 2rem", fontSize: "1.2rem", borderRadius: "1rem", border: "none", cursor: wallet ? "pointer" : "not-allowed" }}
      >
        {spinning ? "Spinning..." : "Spin (0.05 STT)"}
      </button>
      {errorMessage && (
        <div className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow">
          {successMessage}
        </div>
      )}
      {result && result === "Try Again" && (
        <div className="result text-xl font-semibold mt-4 text-yellow-400">
          😢 Try again next time.
        </div>
      )}
    </div>
  );
}
