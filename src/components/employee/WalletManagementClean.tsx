import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Wallet, Building2, Plus, ArrowRightLeft, CreditCard, TrendingUp } from 'lucide-react';

interface WalletManagementProps {
  onClose: () => void;
  businessBalance?: number;
  personalBalance?: number;
  onUpdateBalances?: (business: number, personal: number) => void;
}

type Screen = 'home' | 'add-money' | 'transfer' | 'cards' | 'insights';

export function WalletManagementClean({ onClose, businessBalance = 45000, personalBalance = 12500, onUpdateBalances }: WalletManagementProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [businessBal, setBusinessBal] = useState(businessBalance);
  const [personalBal, setPersonalBal] = useState(personalBalance);
  const [amount, setAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<'business' | 'personal'>('business');

  const handleAddMoney = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (selectedWallet === 'business') {
      const newBal = businessBal + amt;
      setBusinessBal(newBal);
      if (onUpdateBalances) onUpdateBalances(newBal, personalBal);
    } else {
      const newBal = personalBal + amt;
      setPersonalBal(newBal);
      if (onUpdateBalances) onUpdateBalances(businessBal, newBal);
    }

    alert(`✅ Successfully added ₹${amt.toLocaleString()} to ${selectedWallet} wallet!`);
    setCurrentScreen('home');
  };

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 999999,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      />

      {/* Modal Container */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000000,
          maxWidth: currentScreen === 'home' ? '1200px' : '600px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
          {currentScreen === 'home' && (
            <div style={{ padding: '32px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>Wallet Management</h2>
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X style={{ width: '24px', height: '24px', color: '#4B5563' }} />
                </button>
              </div>

              {/* Wallet Balances - NO GRADIENTS, USING #000035 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                {/* Business Wallet */}
                <div style={{ 
                  padding: '32px', 
                  backgroundColor: '#000035',
                  borderRadius: '16px', 
                  color: 'white',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 53, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ 
                      width: '56px', 
                      height: '56px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Building2 style={{ width: '28px', height: '28px' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', opacity: 0.9 }}>Business Wallet</p>
                      <p style={{ fontSize: '12px', opacity: 0.75 }}>Official expenses</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>₹{businessBal.toLocaleString()}</p>
                  <p style={{ fontSize: '14px', opacity: 0.9 }}>Available Balance</p>
                </div>

                {/* Personal Wallet */}
                <div style={{ 
                  padding: '32px', 
                  backgroundColor: '#000035',
                  borderRadius: '16px', 
                  color: 'white',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 53, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ 
                      width: '56px', 
                      height: '56px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Wallet style={{ width: '28px', height: '28px' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', opacity: 0.9 }}>Personal Wallet</p>
                      <p style={{ fontSize: '12px', opacity: 0.75 }}>Personal expenses</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>₹{personalBal.toLocaleString()}</p>
                  <p style={{ fontSize: '14px', opacity: 0.9 }}>Available Balance</p>
                </div>
              </div>

              {/* Quick Actions */}
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {/* Add Money Card */}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setCurrentScreen('add-money');
                  }}
                  style={{
                    padding: '24px',
                    backgroundColor: 'white',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#000035';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 53, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '50%', 
                    backgroundColor: '#e6e6f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <Plus style={{ width: '28px', height: '28px', color: '#000035' }} />
                  </div>
                  <p style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Add Money</p>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>Top up wallet</p>
                </div>

                {/* Transfer Card */}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setCurrentScreen('transfer');
                  }}
                  style={{
                    padding: '24px',
                    backgroundColor: 'white',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#000035';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 53, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '50%', 
                    backgroundColor: '#e6e6f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <ArrowRightLeft style={{ width: '28px', height: '28px', color: '#000035' }} />
                  </div>
                  <p style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Transfer</p>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>Send money</p>
                </div>

                {/* Cards Card */}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setCurrentScreen('cards');
                  }}
                  style={{
                    padding: '24px',
                    backgroundColor: 'white',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#000035';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 53, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '50%', 
                    backgroundColor: '#e6e6f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <CreditCard style={{ width: '28px', height: '28px', color: '#000035' }} />
                  </div>
                  <p style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Cards</p>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>Manage cards</p>
                </div>

                {/* Insights Card */}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setCurrentScreen('insights');
                  }}
                  style={{
                    padding: '24px',
                    backgroundColor: 'white',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#000035';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 53, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '50%', 
                    backgroundColor: '#e6e6f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <TrendingUp style={{ width: '28px', height: '28px', color: '#000035' }} />
                  </div>
                  <p style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Insights</p>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>Analytics</p>
                </div>
              </div>

              {/* Recent Transactions */}
              <div style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Recent Transactions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { desc: 'Flight Booking - Mumbai to Delhi', amount: -8500, type: 'debit', date: 'Dec 18, 2024' },
                    { desc: 'Wallet Top-up via UPI', amount: 10000, type: 'credit', date: 'Dec 17, 2024' },
                    { desc: 'Hotel Booking - 2 Nights', amount: -6800, type: 'debit', date: 'Dec 16, 2024' },
                  ].map((txn, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '16px', 
                      backgroundColor: '#F9FAFB', 
                      borderRadius: '8px' 
                    }}>
                      <div>
                        <p style={{ fontWeight: '500', color: '#111827' }}>{txn.desc}</p>
                        <p style={{ fontSize: '14px', color: '#6B7280' }}>{txn.date}</p>
                      </div>
                      <p style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        color: txn.type === 'credit' ? '#10b981' : '#ef4444' 
                      }}>
                        {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentScreen === 'add-money' && (
            <div style={{ padding: '32px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>Add Money</h2>
                  <p style={{ color: '#6B7280', marginTop: '4px' }}>Top up your wallet balance</p>
                </div>
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setCurrentScreen('home');
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X style={{ width: '24px', height: '24px', color: '#4B5563' }} />
                </button>
              </div>

              {/* Select Wallet */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                  Select Wallet
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setSelectedWallet('business');
                    }}
                    style={{
                      padding: '20px',
                      border: `2px solid ${selectedWallet === 'business' ? '#000035' : '#E5E7EB'}`,
                      backgroundColor: selectedWallet === 'business' ? '#f5f5f8' : 'white',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <Building2 style={{ width: '20px', height: '20px', color: '#000035' }} />
                      <span style={{ fontWeight: '600' }}>Business Wallet</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#6B7280' }}>Balance: ₹{businessBal.toLocaleString()}</p>
                  </div>

                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setSelectedWallet('personal');
                    }}
                    style={{
                      padding: '20px',
                      border: `2px solid ${selectedWallet === 'personal' ? '#000035' : '#E5E7EB'}`,
                      backgroundColor: selectedWallet === 'personal' ? '#f5f5f8' : 'white',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <Wallet style={{ width: '20px', height: '20px', color: '#000035' }} />
                      <span style={{ fontWeight: '600' }}>Personal Wallet</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#6B7280' }}>Balance: ₹{personalBal.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                  Enter Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  style={{
                    width: '100%',
                    height: '56px',
                    padding: '0 16px',
                    fontSize: '20px',
                    border: '2px solid #D1D5DB',
                    borderRadius: '12px',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#000035'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />

                {/* Quick amounts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '16px' }}>
                  {[1000, 2000, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setAmount(amt.toString());
                      }}
                      style={{
                        height: '44px',
                        border: '2px solid #D1D5DB',
                        borderRadius: '8px',
                        background: 'white',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#000035';
                        e.currentTarget.style.backgroundColor = '#f5f5f8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#D1D5DB';
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button - NO GRADIENT */}
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleAddMoney();
                }}
                style={{
                  width: '100%',
                  height: '56px',
                  backgroundColor: '#000035',
                  color: 'white',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '16px',
                }}
              >
                <Plus style={{ width: '20px', height: '20px' }} />
                Add Money
              </button>
            </div>
          )}

          {(currentScreen === 'transfer' || currentScreen === 'cards' || currentScreen === 'insights') && (
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>
                    {currentScreen === 'transfer' && 'Transfer Money'}
                    {currentScreen === 'cards' && 'Saved Cards'}
                    {currentScreen === 'insights' && 'Spending Insights'}
                  </h2>
                  <p style={{ color: '#6B7280', marginTop: '4px' }}>
                    {currentScreen === 'transfer' && 'Send money between wallets'}
                    {currentScreen === 'cards' && 'Manage your payment methods'}
                    {currentScreen === 'insights' && 'View your analytics and reports'}
                  </p>
                </div>
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setCurrentScreen('home');
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X style={{ width: '24px', height: '24px', color: '#4B5563' }} />
                </button>
              </div>
              <p style={{ textAlign: 'center', color: '#6B7280', padding: '80px 0' }}>
                {currentScreen === 'transfer' && 'Transfer functionality coming soon!'}
                {currentScreen === 'cards' && 'Cards management coming soon!'}
                {currentScreen === 'insights' && 'Insights coming soon!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
