// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MobilisDAO
 * @dev Simple DAO simulation: any address can create a proposal, members vote
 * yes/no (one vote per address per proposal), and after the voting period ends
 * the proposal can be executed (flips a boolean + emits event — no real fund
 * transfer, this is a logic sandbox).
 */
contract MobilisDAO {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        bool passed;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public constant VOTING_PERIOD = 5 minutes; // short for sandbox testing

    event ProposalCreated(uint256 indexed id, string title, address indexed proposer, uint256 deadline);
    event Voted(uint256 indexed id, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed id, bool passed);

    function createProposal(string memory title, string memory description) external returns (uint256) {
        proposalCount++;
        uint256 id = proposalCount;
        proposals[id] = Proposal({
            id: id,
            title: title,
            description: description,
            proposer: msg.sender,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + VOTING_PERIOD,
            executed: false,
            passed: false
        });
        emit ProposalCreated(id, title, msg.sender, block.timestamp + VOTING_PERIOD);
        return id;
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(p.id != 0, "Proposal does not exist");
        require(block.timestamp < p.deadline, "Voting period ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        hasVoted[proposalId][msg.sender] = true;
        if (support) {
            p.votesFor++;
        } else {
            p.votesAgainst++;
        }
        emit Voted(proposalId, msg.sender, support);
    }

    function executeProposal(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(p.id != 0, "Proposal does not exist");
        require(block.timestamp >= p.deadline, "Voting still active");
        require(!p.executed, "Already executed");

        p.executed = true;
        p.passed = p.votesFor > p.votesAgainst;
        emit ProposalExecuted(proposalId, p.passed);
    }

    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return proposals[proposalId];
    }
}
