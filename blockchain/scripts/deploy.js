const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 1. NFT
  const MobilisNFT = await hre.ethers.getContractFactory("MobilisNFT");
  const nft = await MobilisNFT.deploy();
  await nft.waitForDeployment();
  console.log("MobilisNFT deployed to:", await nft.getAddress());

  // 2. DeFi Token + Lending Pool
  const MobilisToken = await hre.ethers.getContractFactory("MobilisToken");
  const token = await MobilisToken.deploy();
  await token.waitForDeployment();
  console.log("MobilisToken deployed to:", await token.getAddress());

  const MobilisLendingPool = await hre.ethers.getContractFactory("MobilisLendingPool");
  const lendingPool = await MobilisLendingPool.deploy(await token.getAddress());
  await lendingPool.waitForDeployment();
  console.log("MobilisLendingPool deployed to:", await lendingPool.getAddress());

  // Seed the pool with liquidity so borrow() has something to lend
  const seedAmount = hre.ethers.parseUnits("50000", 18);
  await token.approve(await lendingPool.getAddress(), seedAmount);
  await lendingPool.deposit(seedAmount);
  console.log("Seeded lending pool with 50,000 MTT liquidity");

  // 3. DAO
  const MobilisDAO = await hre.ethers.getContractFactory("MobilisDAO");
  const dao = await MobilisDAO.deploy();
  await dao.waitForDeployment();
  console.log("MobilisDAO deployed to:", await dao.getAddress());

  // 4. Supply Chain
  const MobilisSupplyChain = await hre.ethers.getContractFactory("MobilisSupplyChain");
  const supplyChain = await MobilisSupplyChain.deploy();
  await supplyChain.waitForDeployment();
  console.log("MobilisSupplyChain deployed to:", await supplyChain.getAddress());

  // 5. Identity
  const MobilisIdentity = await hre.ethers.getContractFactory("MobilisIdentity");
  const identity = await MobilisIdentity.deploy();
  await identity.waitForDeployment();
  console.log("MobilisIdentity deployed to:", await identity.getAddress());

  // Write addresses + ABIs to a single JSON file the frontend can import directly
  const artifactsDir = path.join(__dirname, "../artifacts/contracts");
  const getAbi = (contractName, fileName) => {
    const artifact = JSON.parse(
      fs.readFileSync(path.join(artifactsDir, `${fileName}.sol/${contractName}.json`))
    );
    return artifact.abi;
  };

  const deployment = {
    chainId: 31337,
    rpcUrl: "http://127.0.0.1:8545",
    deployedAt: new Date().toISOString(),
    contracts: {
      MobilisNFT: { address: await nft.getAddress(), abi: getAbi("MobilisNFT", "MobilisNFT") },
      MobilisToken: { address: await token.getAddress(), abi: getAbi("MobilisToken", "MobilisDeFi") },
      MobilisLendingPool: { address: await lendingPool.getAddress(), abi: getAbi("MobilisLendingPool", "MobilisDeFi") },
      MobilisDAO: { address: await dao.getAddress(), abi: getAbi("MobilisDAO", "MobilisDAO") },
      MobilisSupplyChain: { address: await supplyChain.getAddress(), abi: getAbi("MobilisSupplyChain", "MobilisSupplyChain") },
      MobilisIdentity: { address: await identity.getAddress(), abi: getAbi("MobilisIdentity", "MobilisIdentity") }
    }
  };

  // Output directly into the frontend source so it can import as JSON
  const outputPath = path.join(__dirname, "../../src/dashboard/blockchain/deployment.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(deployment, null, 2));
  console.log("\n✅ Deployment info written to src/dashboard/blockchain/deployment.json");
  console.log("Frontend can now connect to these contracts.\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
