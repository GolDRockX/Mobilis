import { Wallet } from 'lucide-react';

export function SimAccountSelector({ accounts, selectedId, setSelectedId }) {
  const current = accounts.find(a => a.id === selectedId);
  return (
    <div className="chain-account-selector">
      <Wallet size={15} color="var(--accent)" />
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(parseInt(e.target.value))}
        className="chain-account-select"
      >
        {accounts.map(acc => (
          <option key={acc.id} value={acc.id}>{acc.label}</option>
        ))}
      </select>
      {current && (
        <span className="chain-balance">{parseFloat(current.eth_balance).toFixed(4)} ETH</span>
      )}
    </div>
  );
}
