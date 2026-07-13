// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title MobilisNFT
 * @dev Simple ERC721 with built-in marketplace: mint, list for sale, buy, cancel listing.
 * All state lives on-chain so the frontend can read live ownership/listing status.
 */
contract MobilisNFT is ERC721 {
    uint256 private _nextTokenId;

    struct Listing {
        uint256 price; // in wei, 0 = not listed
        address seller;
    }

    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => Listing) public listings;

    event Minted(uint256 indexed tokenId, address indexed owner, string uri);
    event Listed(uint256 indexed tokenId, uint256 price, address indexed seller);
    event Sold(uint256 indexed tokenId, uint256 price, address indexed from, address indexed to);
    event ListingCancelled(uint256 indexed tokenId);

    constructor() ERC721("Mobilis Test NFT", "MTNFT") {}

    function mint(string memory uri) external returns (uint256) {
        _nextTokenId++;
        uint256 newId = _nextTokenId;
        _mint(msg.sender, newId);
        _tokenURIs[newId] = uri;
        emit Minted(newId, msg.sender, uri);
        return newId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenURIs[tokenId];
    }

    function listForSale(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be > 0");
        listings[tokenId] = Listing(price, msg.sender);
        emit Listed(tokenId, price, msg.sender);
    }

    function cancelListing(uint256 tokenId) external {
        require(listings[tokenId].seller == msg.sender, "Not the seller");
        delete listings[tokenId];
        emit ListingCancelled(tokenId);
    }

    function buy(uint256 tokenId) external payable {
        Listing memory item = listings[tokenId];
        require(item.price > 0, "Not listed");
        require(msg.value >= item.price, "Insufficient payment");
        address seller = item.seller;

        delete listings[tokenId];
        _transfer(seller, msg.sender, tokenId);
        payable(seller).transfer(item.price);

        // Refund excess payment
        if (msg.value > item.price) {
            payable(msg.sender).transfer(msg.value - item.price);
        }

        emit Sold(tokenId, item.price, seller, msg.sender);
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }
}
