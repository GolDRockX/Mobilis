import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import { useOutletContext } from 'react-router-dom';
import api from '../../services/api';
import { Wallet, Link2, Link2Off, ExternalLink } from 'lucide-react';
import './Wallet.css';

export default function WalletPage() {
  const { onMenuToggle } = useOutletContext();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState('');
  const [msg, setMsg] = useState(null);

  const connectMetaMask = async () => {
    if (!window.ethereum) return setMsg({ type: 'error', text: 'MetaMask not installed. Please install the MetaMask browser extension.' });
    setLoading('metamask');
    setMsg(null);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      await api.post('/trade/wallet/connect', { wallet_address: address, wallet_type: 'MetaMask' });
      await refreshUser();
      setMsg({ type: 'success', text: 'MetaMask wallet connected successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to connect MetaMask' });
    } finally {
      setLoading('');
    }
  };

  const connectCoinbase = async () => {
    if (!window.ethereum?.isCoinbaseWallet && !window.coinbaseWalletExtension) {
      return setMsg({ type: 'error', text: 'Coinbase Wallet not found. Please install the Coinbase Wallet browser extension.' });
    }
    setLoading('coinbase');
    setMsg(null);
    try {
      const provider = window.coinbaseWalletExtension || window.ethereum;
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      await api.post('/trade/wallet/connect', { wallet_address: address, wallet_type: 'Coinbase' });
      await refreshUser();
      setMsg({ type: 'success', text: 'Coinbase Wallet connected successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to connect Coinbase Wallet' });
    } finally {
      setLoading('');
    }
  };

  const disconnect = async () => {
    setLoading('disconnect');
    setMsg(null);
    try {
      await api.post('/trade/wallet/disconnect');
      await refreshUser();
      setMsg({ type: 'success', text: 'Wallet disconnected.' });
    } catch {
      setMsg({ type: 'error', text: 'Failed to disconnect wallet.' });
    } finally {
      setLoading('');
    }
  };

  const short = (addr) => addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : '';

  return (
    <div className="page">
      <Header title="Wallet" onMenuToggle={onMenuToggle} />
      <div className="page-content">

        {user?.wallet_address ? (
          <div className="card wallet-connected-card">
            <div className="wallet-connected-icon">
              <Wallet size={32} color="var(--accent)" />
            </div>
            <div className="wallet-connected-info">
              <p className="wallet-connected-label">Connected via {user.wallet_type}</p>
              <p className="wallet-connected-addr">{user.wallet_address}</p>
              <a
                href={`https://etherscan.io/address/${user.wallet_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="wallet-etherscan"
              >
                View on Etherscan <ExternalLink size={12} />
              </a>
            </div>
            <button
              className="btn-ghost disconnect-btn"
              onClick={disconnect}
              disabled={loading === 'disconnect'}
            >
              <Link2Off size={16} />
              {loading === 'disconnect' ? 'Disconnecting...' : 'Disconnect'}
            </button>
          </div>
        ) : (
          <div className="wallet-connect-grid">
            <div className="card wallet-option-card">
              <div className="wallet-option-icon metamask-icon">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" width={48} />
              </div>
              <h3>MetaMask</h3>
              <p>Connect using MetaMask — the most popular Ethereum wallet.</p>
              <button
                className="btn-primary wallet-connect-btn"
                onClick={connectMetaMask}
                disabled={!!loading}
              >
                <Link2 size={16} />
                {loading === 'metamask' ? 'Connecting...' : 'Connect MetaMask'}
              </button>
            </div>

            <div className="card wallet-option-card">
              <div className="wallet-option-icon coinbase-icon">
                <img src="https://altcoinsbox.com/wp-content/uploads/2023/01/coinbase-wallet-logo.png" alt="Coinbase" width={48} style={{ borderRadius: 12 }} />
              </div>
              <h3>Coinbase Wallet</h3>
              <p>Connect using Coinbase Wallet for secure crypto management.</p>
              <button
                className="btn-primary wallet-connect-btn"
                onClick={connectCoinbase}
                disabled={!!loading}
              >
                <Link2 size={16} />
                {loading === 'coinbase' ? 'Connecting...' : 'Connect Coinbase'}
              </button>
            </div>
          </div>
        )}

        {msg && <div className={`wallet-msg ${msg.type}`}>{msg.text}</div>}

        <div className="card wallet-info-card">
          <h3 className="section-title">About Wallet Connection</h3>
          <ul className="wallet-info-list">
            <li>Your wallet address is saved to your Mobilis profile.</li>
            <li>Connecting a wallet enables on-chain transaction verification.</li>
            <li>We never request access to your private keys or seed phrase.</li>
            <li>Make sure you have MetaMask or Coinbase Wallet extension installed in your browser.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
