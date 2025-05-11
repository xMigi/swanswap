// utils/wheelLogic.js

export function getRandomReward() {
  const rewards = [
    { label: "Try Again", weight: 50 },
    { label: "10 SWAN", weight: 30 },
    { label: "100 SWAN", weight: 15 },
    { label: "0.1 STT", weight: 3 },
    { label: "500 SWAN", weight: 2 },
  ];

  const totalWeight = rewards.reduce((acc, reward) => acc + reward.weight, 0);
  let rand = Math.random() * totalWeight;

  for (const reward of rewards) {
    if (rand < reward.weight) return reward;
    rand -= reward.weight;
  }

  return { label: "Try Again" }; // Fallback just in case
}
