// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MobilisSupplyChain
 * @dev Models a product's journey through a supply chain: creation, custody
 * transfers, and checkpoint events (e.g. "Shipped", "Customs Cleared", "Delivered").
 * Each checkpoint is immutable once recorded, giving a full on-chain provenance trail.
 */
contract MobilisSupplyChain {
    struct Checkpoint {
        string status;
        string location;
        address recordedBy;
        uint256 timestamp;
    }

    struct Product {
        uint256 id;
        string name;
        address currentHolder;
        address originCreator;
        uint256 createdAt;
        bool exists;
    }

    uint256 public productCount;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Checkpoint[]) public productHistory;

    event ProductCreated(uint256 indexed id, string name, address indexed creator);
    event CheckpointAdded(uint256 indexed id, string status, string location, address indexed recordedBy);
    event CustodyTransferred(uint256 indexed id, address indexed from, address indexed to);

    function createProduct(string memory name, string memory originLocation) external returns (uint256) {
        productCount++;
        uint256 id = productCount;
        products[id] = Product({
            id: id,
            name: name,
            currentHolder: msg.sender,
            originCreator: msg.sender,
            createdAt: block.timestamp,
            exists: true
        });

        productHistory[id].push(Checkpoint({
            status: "Created",
            location: originLocation,
            recordedBy: msg.sender,
            timestamp: block.timestamp
        }));

        emit ProductCreated(id, name, msg.sender);
        return id;
    }

    function addCheckpoint(uint256 productId, string memory status, string memory location) external {
        Product storage p = products[productId];
        require(p.exists, "Product does not exist");
        require(p.currentHolder == msg.sender, "Only current holder can add checkpoint");

        productHistory[productId].push(Checkpoint({
            status: status,
            location: location,
            recordedBy: msg.sender,
            timestamp: block.timestamp
        }));

        emit CheckpointAdded(productId, status, location, msg.sender);
    }

    function transferCustody(uint256 productId, address newHolder) external {
        Product storage p = products[productId];
        require(p.exists, "Product does not exist");
        require(p.currentHolder == msg.sender, "Only current holder can transfer");

        address oldHolder = p.currentHolder;
        p.currentHolder = newHolder;

        productHistory[productId].push(Checkpoint({
            status: "Custody Transferred",
            location: "",
            recordedBy: msg.sender,
            timestamp: block.timestamp
        }));

        emit CustodyTransferred(productId, oldHolder, newHolder);
    }

    function getHistory(uint256 productId) external view returns (Checkpoint[] memory) {
        return productHistory[productId];
    }

    function getHistoryLength(uint256 productId) external view returns (uint256) {
        return productHistory[productId].length;
    }
}
