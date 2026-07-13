// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MobilisToken
 * @dev Simple ERC20 used as the "deposit/borrow" asset for the DeFi demo.
 * Anyone can mint test tokens via faucet() — this is a sandbox, not real money.
 */
contract MobilisToken is ERC20 {
    constructor() ERC20("Mobilis Test Token", "MTT") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    /// @dev Faucet so test accounts can top up their balance freely.
    function faucet(uint256 amount) external {
        require(amount <= 10_000 * 10 ** decimals(), "Max 10,000 MTT per faucet call");
        _mint(msg.sender, amount);
    }
}

/**
 * @title MobilisLendingPool
 * @dev Simplified lending/staking pool:
 *  - Deposit MTT to earn interest (staking)
 *  - Borrow MTT against no collateral (sandbox simplification) up to a pool-based limit
 *  - Interest accrues per-second based on a fixed APR
 */
contract MobilisLendingPool {
    MobilisToken public token;

    uint256 public constant SUPPLY_APR_BPS = 500;   // 5.00% APR for suppliers
    uint256 public constant BORROW_APR_BPS = 1000;  // 10.00% APR for borrowers
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    struct Position {
        uint256 principal;
        uint256 lastUpdated;
    }

    mapping(address => Position) public deposits;
    mapping(address => Position) public borrows;

    uint256 public totalDeposits;
    uint256 public totalBorrows;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 interestEarned);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount, uint256 interestPaid);

    constructor(address tokenAddress) {
        token = MobilisToken(tokenAddress);
    }

    function _accrue(Position memory pos, uint256 aprBps) internal view returns (uint256) {
        if (pos.principal == 0) return 0;
        uint256 elapsed = block.timestamp - pos.lastUpdated;
        return (pos.principal * aprBps * elapsed) / (10_000 * SECONDS_PER_YEAR);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        Position storage pos = deposits[msg.sender];
        uint256 interest = _accrue(pos, SUPPLY_APR_BPS);
        pos.principal += amount + interest;
        pos.lastUpdated = block.timestamp;

        totalDeposits += amount;
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        Position storage pos = deposits[msg.sender];
        uint256 interest = _accrue(pos, SUPPLY_APR_BPS);
        uint256 available = pos.principal + interest;
        require(amount <= available, "Insufficient balance");

        pos.principal = available - amount;
        pos.lastUpdated = block.timestamp;

        require(token.transfer(msg.sender, amount), "Transfer failed");
        emit Withdrawn(msg.sender, amount, interest);
    }

    function borrow(uint256 amount) external {
        require(amount <= token.balanceOf(address(this)), "Insufficient pool liquidity");

        Position storage pos = borrows[msg.sender];
        uint256 interest = _accrue(pos, BORROW_APR_BPS);
        pos.principal += amount + interest;
        pos.lastUpdated = block.timestamp;

        totalBorrows += amount;
        require(token.transfer(msg.sender, amount), "Transfer failed");
        emit Borrowed(msg.sender, amount);
    }

    function repay(uint256 amount) external {
        Position storage pos = borrows[msg.sender];
        uint256 interest = _accrue(pos, BORROW_APR_BPS);
        uint256 owed = pos.principal + interest;
        uint256 payAmount = amount > owed ? owed : amount;

        require(token.transferFrom(msg.sender, address(this), payAmount), "Transfer failed");
        pos.principal = owed - payAmount;
        pos.lastUpdated = block.timestamp;

        emit Repaid(msg.sender, payAmount, interest);
    }

    function getDepositBalance(address user) external view returns (uint256) {
        Position memory pos = deposits[user];
        return pos.principal + _accrue(pos, SUPPLY_APR_BPS);
    }

    function getBorrowBalance(address user) external view returns (uint256) {
        Position memory pos = borrows[user];
        return pos.principal + _accrue(pos, BORROW_APR_BPS);
    }

    function poolLiquidity() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
