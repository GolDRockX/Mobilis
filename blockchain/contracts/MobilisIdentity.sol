// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MobilisIdentity
 * @dev Simple self-sovereign identity sandbox:
 *  - Any address can register an identity profile (name + metadata)
 *  - A designated "issuer" address can issue credentials to identities
 *    (e.g. "KYC Verified", "Age Over 18", "Certified Developer")
 *  - Anyone can verify whether an address holds a valid (non-revoked) credential
 *  - Issuer can revoke credentials
 */
contract MobilisIdentity {
    struct Identity {
        string name;
        string metadataURI;
        bool registered;
        uint256 registeredAt;
    }

    struct Credential {
        string credentialType;
        address issuer;
        uint256 issuedAt;
        bool revoked;
    }

    address public admin; // deployer, can grant/revoke issuer status
    mapping(address => bool) public isIssuer;
    mapping(address => Identity) public identities;
    mapping(address => Credential[]) public credentials;

    event IdentityRegistered(address indexed user, string name);
    event IssuerGranted(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    event CredentialIssued(address indexed user, string credentialType, address indexed issuer);
    event CredentialRevoked(address indexed user, uint256 credentialIndex);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyIssuer() {
        require(isIssuer[msg.sender], "Only issuer");
        _;
    }

    constructor() {
        admin = msg.sender;
        isIssuer[msg.sender] = true; // deployer is issuer by default (sandbox convenience)
    }

    function registerIdentity(string memory name, string memory metadataURI) external {
        require(!identities[msg.sender].registered, "Already registered");
        identities[msg.sender] = Identity(name, metadataURI, true, block.timestamp);
        emit IdentityRegistered(msg.sender, name);
    }

    function grantIssuer(address issuer) external onlyAdmin {
        isIssuer[issuer] = true;
        emit IssuerGranted(issuer);
    }

    function revokeIssuer(address issuer) external onlyAdmin {
        isIssuer[issuer] = false;
        emit IssuerRevoked(issuer);
    }

    function issueCredential(address user, string memory credentialType) external onlyIssuer {
        require(identities[user].registered, "User has no identity");
        credentials[user].push(Credential(credentialType, msg.sender, block.timestamp, false));
        emit CredentialIssued(user, credentialType, msg.sender);
    }

    function revokeCredential(address user, uint256 credentialIndex) external onlyIssuer {
        require(credentialIndex < credentials[user].length, "Invalid index");
        credentials[user][credentialIndex].revoked = true;
        emit CredentialRevoked(user, credentialIndex);
    }

    function verifyCredential(address user, string memory credentialType) external view returns (bool valid, address issuer, uint256 issuedAt) {
        Credential[] memory creds = credentials[user];
        for (uint256 i = 0; i < creds.length; i++) {
            if (!creds[i].revoked && keccak256(bytes(creds[i].credentialType)) == keccak256(bytes(credentialType))) {
                return (true, creds[i].issuer, creds[i].issuedAt);
            }
        }
        return (false, address(0), 0);
    }

    function getCredentials(address user) external view returns (Credential[] memory) {
        return credentials[user];
    }
}
