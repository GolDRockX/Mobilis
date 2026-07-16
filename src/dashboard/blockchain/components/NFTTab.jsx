import { useState, useEffect, useCallback } from 'react';
import { Image, Tag, ShoppingCart, X, Sparkles } from 'lucide-react';
import { SimAccountSelector } from './SimShared';
import api from '../../services/api';

export default function NFTTab() {
  const [accounts, setAccounts] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [nfts, setNfts] = useState([]);
  const [mintName, setMintName] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [listPriceInputs, setListPriceInputs] = useState({});

  const fetchAll = useCallback(async () => {
    try {
      const [accRes, nftRes] = await Promise.all([api.get('/sim/accounts'), api.get('/sim/nft')]);
      setAccounts(accRes.data);
      setNfts(nftRes.data);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to load sandbox data' });
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleMint = async (e) => {
    e.preventDefault();
    if (!mintName.trim()) return;
    setLoading(true);
    setMsg(null);
    try {
      await api.post('/sim/nft/mint', { account_id: selectedId, name: mintName.trim() });
      setMsg({ type: 'success', text: `Minted "${mintName}" successfully!` });
      setMintName('');
      fetchAll();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleList = async (tokenId) => {
    const price = listPriceInputs[tokenId];
    if (!price || parseFloat(price) <= 0) return;
    setLoading(true);
    setMsg(null);
    try {
      await api.post('/sim/nft/list', { account_id: selectedId, token_id: tokenId, price: parseFloat(price) });
      setMsg({ type: 'success', text: `Listed #${tokenId} for ${price} ETH` });
      fetchAll();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelListing = async (tokenId) => {
    setLoading(true);
    try {
      await api.post('/sim/nft/cancel', { account_id: selectedId, token_id: tokenId });
      setMsg({ type: 'success', text: `Listing cancelled for #${tokenId}` });
      fetchAll();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (tokenId) => {
    setLoading(true);
    setMsg(null);
    try {
      await api.post('/sim/nft/buy', { account_id: selectedId, token_id: tokenId });
      setMsg({ type: 'success', text: `Bought #${tokenId}!` });
      fetchAll();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SimAccountSelector accounts={accounts} selectedId={selectedId} setSelectedId={setSelectedId} />

      <div className="card" style={{ marginTop: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Sparkles size={18} color="var(--accent)" />
          <h3 className="section-title" style={{ margin: 0 }}>Mint New NFT</h3>
        </div>
        <form onSubmit={handleMint} className="chain-inline-form">
          <input
            type="text"
            placeholder="NFT name / metadata (e.g. Mobilis Genesis #1)"
            value={mintName}
            onChange={e => setMintName(e.target.value)}
            required
          />
          <button className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <Image size={15} /> {loading ? 'Minting...' : 'Mint NFT'}
          </button>
        </form>
        {msg && <div className={`wallet-msg ${msg.type}`} style={{ marginTop: 12 }}>{msg.text}</div>}
      </div>

      <div className="card">
        <h3 className="section-title">Marketplace ({nfts.length} NFTs)</h3>
        {nfts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '30px 0' }}>No NFTs minted yet. Mint your first one above!</p>
        ) : (
          <div className="nft-grid">
            {nfts.map(nft => {
              const isMine = nft.owner_account_id === selectedId;
              return (
                <div key={nft.id} className="nft-card">
                  <div className="nft-card-image">
                    <Image size={32} color="var(--text-muted)" />
                  </div>
                  <div className="nft-card-body">
                    <p className="nft-card-title">{nft.name}</p>
                    <p className="nft-card-id">#{nft.id}</p>
                    <p className="nft-card-owner">
                      {isMine ? <span style={{ color: 'var(--accent)' }}>You own this</span> : `Owner: ${accounts.find(a => a.id === nft.owner_account_id)?.label || '—'}`}
                    </p>

                    {nft.listed_price !== null ? (
                      <div className="nft-listed-row">
                        <span className="tag-sell">{parseFloat(nft.listed_price).toFixed(4)} ETH</span>
                        {isMine ? (
                          <button className="admin-btn cancel" onClick={() => handleCancelListing(nft.id)} disabled={loading}>
                            <X size={13} />
                          </button>
                        ) : (
                          <button className="btn-primary" style={{ padding: '5px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => handleBuy(nft.id)} disabled={loading}>
                            <ShoppingCart size={12} /> Buy
                          </button>
                        )}
                      </div>
                    ) : isMine ? (
                      <div className="nft-listed-row">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price (ETH)"
                          className="nft-price-input"
                          value={listPriceInputs[nft.id] || ''}
                          onChange={e => setListPriceInputs({ ...listPriceInputs, [nft.id]: e.target.value })}
                        />
                        <button className="admin-btn edit" onClick={() => handleList(nft.id)} disabled={loading}>
                          <Tag size={13} />
                        </button>
                      </div>
                    ) : (
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Not for sale</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
