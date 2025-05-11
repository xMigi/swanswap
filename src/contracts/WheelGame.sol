// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISwanToken {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract WheelGame {
    address public owner;
    ISwanToken public swanToken;
    uint256 public spinFee = 0.05 ether;

    enum RewardType { TryAgain, Swan10, Swan100, STT01, Swan500 }

    struct RewardInfo {
        string label;
        uint256 amount;
        bool isSTT;
    }

    mapping(RewardType => RewardInfo) public rewards;
    mapping(address => uint256) public lastSpinDay;
    mapping(address => uint256) public spinsToday;

    mapping(address => uint256) public swanWinnings;
    address[] public players;
    mapping(address => bool) private knownPlayers;

    event RewardGiven(address indexed user, string label, uint256 amount, bool isSTT);

    constructor(address _swanToken) {
        owner = msg.sender;
        swanToken = ISwanToken(_swanToken);

        rewards[RewardType.TryAgain] = RewardInfo("Try Again", 0, false);
        rewards[RewardType.Swan10]   = RewardInfo("10 SWAN", 10 ether, false);
        rewards[RewardType.Swan100]  = RewardInfo("100 SWAN", 100 ether, false);
        rewards[RewardType.STT01]    = RewardInfo("0.1 STT", 0.1 ether, true);
        rewards[RewardType.Swan500]  = RewardInfo("500 SWAN", 500 ether, false);
    }

    function spin(uint8 rewardId) external payable {
        require(msg.value == spinFee, "Fee must be 0.05 STT");
        require(rewardId <= uint8(RewardType.Swan500), "Invalid reward");

        uint256 today = block.timestamp / 1 days;
        if (lastSpinDay[msg.sender] < today) {
            spinsToday[msg.sender] = 0;
            lastSpinDay[msg.sender] = today;
        }

        require(spinsToday[msg.sender] < 3, "Daily limit reached");
        spinsToday[msg.sender]++;

        RewardInfo memory reward = rewards[RewardType(rewardId)];

        if (reward.amount > 0) {
            if (reward.isSTT) {
                require(address(this).balance >= reward.amount, "Not enough STT in contract");
                payable(msg.sender).transfer(reward.amount);
            } else {
                require(swanToken.transfer(msg.sender, reward.amount), "SWAN transfer failed");
                swanWinnings[msg.sender] += reward.amount;
                if (!knownPlayers[msg.sender]) {
                    players.push(msg.sender);
                    knownPlayers[msg.sender] = true;
                }
            }
        }

        emit RewardGiven(msg.sender, reward.label, reward.amount, reward.isSTT);
    }

    // ADMIN FUNCTIONS

    function depositSWAN(uint256 amount) external {
        require(swanToken.transferFrom(msg.sender, address(this), amount), "Deposit failed");
    }

    function withdrawSTT(uint256 amount) external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(amount);
    }

    function withdrawSWAN(uint256 amount) external {
        require(msg.sender == owner, "Only owner");
        require(swanToken.transfer(owner, amount), "SWAN withdraw failed");
    }

    function getLeaderboard() external view returns (address[] memory, uint256[] memory) {
        uint256 length = players.length;
        uint256[] memory winnings = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            winnings[i] = swanWinnings[players[i]];
        }

        return (players, winnings);
    }

    receive() external payable {} // allow STT deposits
} 