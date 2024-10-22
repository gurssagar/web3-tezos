// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CentralAccount
 * @dev A contract that manages a central account for depositing, withdrawing, and paying funds.
 * The contract owner can perform administrative actions such as paying funds to recipients.
 */
contract CentralAccount {
    address public owner;
    address public fixedAddress = 0x43A071fa2103F24Bbcd7aD3215b5Ed226484473c;
    mapping(address => uint256) public balances;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Paid(address indexed recipient, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }

    // Deposit funds into the central account and forward to the fixed address
    function deposit(uint256 amount) external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0.");

        balances[msg.sender] += msg.value; // Track balance of depositor

        // Forward the funds to the fixed address
        payable(fixedAddress).transfer(msg.value);

        emit Deposited(msg.sender, amount);
    }

    // Withdraw funds from the central account
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance.");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }

    // Pay a specified amount to a recipient from the central account
    function pay(address payable recipient, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient funds in central account.");
        recipient.transfer(amount);
        emit Paid(recipient, amount);
    }

    // View the contract's balance
    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
