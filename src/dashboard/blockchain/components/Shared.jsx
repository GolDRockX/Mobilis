import { AlertTriangle, CheckCircle2, Wallet } from 'lucide-react';

export function ConnectionBanner({ connected, error, isDeployed }) {
  if (!connected) {
    return (
      <div className="chain-banner chain-banner-error">
        <AlertTriangle size={16} />
        <span>{error || 'Not connected to local Hardhat node.'} Run <code>npm run node</code> then <code>npm run deploy</code> inside the <code>blockchain</code> folder.</span>
      </div>
    );
  }
  if (!isDeployed) {
    return (
      <div className="chain-banner chain-banner-warning">
        <AlertTriangle size={16} />
        <span>Connected to Hardhat node, but no contracts deployed yet. Run <code>npm run deploy</code> inside the <code>blockchain</code> folder.</span>
      </div>
    );
  }
  return (
    <div className="chain-banner chain-banner-success">
      <CheckCircle2 size={16} />
      <span>Connected to local Hardhat node — contracts deployed and ready.</span>
    </div>
  );
}

export function AccountSelector({ accounts, selectedAccount, setSelectedAccount, balance }) {
  return (
    <div className="chain-account-selector">
      <Wallet size={15} color="var(--accent)" />
      <select
        value={selectedAccount.address}
        onChange={(e) => setSelectedAccount(accounts.find(a => a.address === e.target.value))}
        className="chain-account-select"
      >
        {accounts.map((acc, i) => (
          <option key={acc.address} value={acc.address}>
            Account #{i} — {acc.address.slice(0, 8)}...{acc.address.slice(-4)}
          </option>
        ))}
      </select>
      {balance !== null && (
        <span className="chain-balance">{parseFloat(balance).toFixed(4)} ETH</span>
      )}
    </div>
  );
}
