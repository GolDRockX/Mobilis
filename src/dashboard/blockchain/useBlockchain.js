import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import deployment from './deployment.json';

// Hardhat's default pre-funded test accounts (same every time you restart `hardhat node`).
// These are PUBLIC, WELL-KNOWN test keys — never use them for anything real.
export const HARDHAT_ACCOUNTS = [
  { address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' },
  { address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d' },
  { address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a' },
  { address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6' },
  { address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', privateKey: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a' },
];

const RPC_URL = deployment.rpcUrl || 'http://127.0.0.1:8545';

export function useBlockchain() {
  const [provider, setProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(HARDHAT_ACCOUNTS[0]);
  const [signer, setSigner] = useState(null);
  const [balance, setBalance] = useState(null);

  const connect = useCallback(async () => {
    try {
      const p = new ethers.JsonRpcProvider(RPC_URL);
      await p.getBlockNumber(); // throws if node isn't running
      setProvider(p);
      setConnected(true);
      setError(null);
      return p;
    } catch (err) {
      setConnected(false);
      setError('Cannot reach local Hardhat node at ' + RPC_URL + '. Make sure `npm run node` is running in the blockchain folder.');
      return null;
    }
  }, []);

  useEffect(() => {
    connect();
    const interval = setInterval(connect, 8000); // retry connection periodically
    return () => clearInterval(interval);
  }, [connect]);

  useEffect(() => {
    if (!provider || !selectedAccount) return;
    const wallet = new ethers.Wallet(selectedAccount.privateKey, provider);
    setSigner(wallet);
    provider.getBalance(selectedAccount.address).then(b => setBalance(ethers.formatEther(b))).catch(() => {});
  }, [provider, selectedAccount]);

  const getContract = useCallback((name) => {
    if (!signer || !deployment.contracts?.[name]) return null;
    const { address, abi } = deployment.contracts[name];
    if (!address) return null;
    return new ethers.Contract(address, abi, signer);
  }, [signer]);

  const isDeployed = Object.keys(deployment.contracts || {}).length > 0;

  return {
    provider,
    signer,
    connected,
    error,
    selectedAccount,
    setSelectedAccount,
    balance,
    getContract,
    isDeployed,
    accounts: HARDHAT_ACCOUNTS,
    refreshConnection: connect,
  };
}
