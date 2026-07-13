# Mobilis Blockchain Sandbox

A local Hardhat-based sandbox powering 5 simulated Web3 systems inside the
**Bitcoin Test** page: NFT Marketplace, DeFi (lending/staking), DAO Voting,
Supply Chain tracking, and Identity/Credential verification.

Everything runs on a **local blockchain** — no real crypto, no mainnet, no
gas costs. Pre-funded fake accounts come built in.

This folder is NOT pushed to GitHub (per your instruction) — it only runs
locally on your machine, like a second backend.

---

## One-time setup

```bash
cd mobilis/blockchain
npm install
```

## Every time you want to use the sandbox

You need **two terminals** running at the same time (in addition to your
existing frontend + backend terminals):

**Terminal A — start the local blockchain:**
```bash
cd mobilis/blockchain
npm run node
```
Leave this running. It prints 20 pre-funded test accounts with 10,000 ETH
each — the first 5 of these are what the dashboard's account selector uses.

**Terminal B — deploy the contracts (only needed once per node restart):**
```bash
cd mobilis/blockchain
npm run deploy
```
This deploys all 5 contract systems and writes their addresses + ABIs to
`mobilis/src/dashboard/blockchain/deployment.json` — the frontend reads this
file automatically, so no manual copying needed.

⚠️ **Important:** every time you restart Terminal A (the node), the
blockchain resets completely (fresh accounts, empty contracts). You must
re-run `npm run deploy` in Terminal B afterward, or the dashboard will show
"no contracts deployed."

---

## What's inside

| Contract | Purpose |
|---|---|
| `MobilisNFT.sol` | ERC721 NFT with mint + built-in marketplace (list, buy, cancel) |
| `MobilisToken.sol` + `MobilisLendingPool.sol` | Test ERC20 token + lending pool (deposit/earn 5% APR, borrow/pay 10% APR) |
| `MobilisDAO.sol` | Proposal creation, voting (5 min voting window), execution |
| `MobilisSupplyChain.sol` | Product creation, checkpoints, custody transfer, full history |
| `MobilisIdentity.sol` | Identity registration, credential issuing/revoking, verification |

## How the dashboard connects

The dashboard's Bitcoin Test page has 6 sub-tabs: BTC Trading (existing),
NFT Marketplace, DeFi, DAO Voting, Supply Chain, and Identity. Each of the
5 new tabs connects directly to your local Hardhat node via `ethers.js`
using one of 5 pre-loaded test accounts — you can switch between them with
the account dropdown at the top of each tab to simulate different users
interacting with the same contracts.

No MetaMask needed for this sandbox — it uses the test account private keys
directly (these are Hardhat's well-known, publicly documented test keys,
safe only for local sandboxes, never for real funds).
