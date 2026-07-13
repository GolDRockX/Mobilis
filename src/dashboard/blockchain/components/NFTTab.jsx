import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Image, Tag, ShoppingCart, X, Sparkles } from 'lucide-react';
import { ConnectionBanner, AccountSelector } from './Shared';

export default function NFTTab({ chain }) {
  const { connected, error, isDeployed, accounts, selectedAccount, setSelectedAccount, balance, getContract } = chain;
  const [nfts, setNfts] = useState([]);
  const [mintName, setMintName] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [listPriceInputs, setListPriceInputs] = useState({});

  const nftContract = getContract('MobilisNFT');

  const fetchNfts = useCallback(async () => {
    if (!nftContract) return;
    try {
      const total = await nftContract.totalSupply();
      const items = [];
      for (let i = 1; i <= Number(total); i++) {
        try {
          const owner = await nftContract.ownerOf(i);
          const uri = await nftContract.tokenURI(i);
          const listing = await nftContract.listings(i);
          items.push({
            id: i,
            owner,
            uri,
            listed: listing.price > 0n,
            price: listing.price,
          });
        } catch { /* token burned or doesn't exist */ }
      }
      setNfts(items.reverse());
    } catch (err) {
      console.error(err);
    }
  }, [nftContract]);

  useEffect(() => { fetchNfts(); }, [fetchNfts, selectedAccount]);

  const handleMint = async (e) => {
    e.preventDefault();
    if (!nftContract || !mintName.trim()) return;
    setLoading(true);
    setMsg(null);
    try {
      const tx = await nftContract.mint(mintName.trim());
      await tx.wait();
      setMsg({ type: 'success', text: `Minted "${mintName}" successfully!` });
      setMintName('');
      fetchNfts();
    } catch (err) {
      setMsg({ type: 'error', text: err.reason || err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleList = async (tokenId) => {
    const priceEth = listPriceInputs[tokenId];
    if (!priceEth || parseFloat(priceEth) <= 0) return;
    setLoading(true);
    setMsg(null);
    try {
      const tx = await nftContract.listForSale(tokenId, ethers.parseEther(priceEth));
      await tx.wait();
      setMsg({ type: 'success', text: `Listed #${tokenId} for ${priceEth} ETH` });
      fetchNfts();
    } catch (err) {
      setMsg({ type: 'error', text: err.reason || err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelListing = async (tokenId) => {
    setLoading(true);
    try {
      const tx = await nftContract.cancelListing(tokenId);
      await tx.wait();
      setMsg({ type: 'success', text: `Listing cancelled for #${tokenId}` });
      fetchNfts();
    } catch (err) {
      setMsg({ type: 'error', text: err.reason || err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (tokenId, price) => {
    setLoading(true);
    setMsg(null);
    try {
      const tx = await nftContract.buy(tokenId, { value: price });
      await tx.wait();
      setMsg({ type: 'success', text: `Bought #${tokenId}!` });
      fetchNfts();
    } catch (err) {
      setMsg({ type: 'error', text: err.reason || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ConnectionBanner connected={connected} error={error} isDeployed={isDeployed} />
      {connected && isDeployed && (
        <>
          <AccountSelector accounts={accounts} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} balance={balance} />

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
                  const isMine = nft.owner.toLowerCase() === selectedAccount.address.toLowerCase();
                  return (
                    <div key={nft.id} className="nft-card">
                      <div className="nft-card-image">
                        <Image size={32} color="var(--text-muted)" />
                      </div>
                      <div className="nft-card-body">
                        <p className="nft-card-title">{nft.uri}</p>
                        <p className="nft-card-id">#{nft.id}</p>
                        <p className="nft-card-owner">
                          {isMine ? <span style={{ color: 'var(--accent)' }}>You own this</span> : `Owner: ${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}`}
                        </p>

                        {nft.listed ? (
                          <div className="nft-listed-row">
                            <span className="tag-sell">{ethers.formatEther(nft.price)} ETH</span>
                            {isMine ? (
                              <button className="admin-btn cancel" onClick={() => handleCancelListing(nft.id)} disabled={loading}>
                                <X size={13} />
                              </button>
                            ) : (
                              <button className="btn-primary" style={{ padding: '5px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => handleBuy(nft.id, nft.price)} disabled={loading}>
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
        </>
      )}
    </div>
  );
}
