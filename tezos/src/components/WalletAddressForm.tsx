import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { redirect } from './redirect'; // Adjust the import path as necessary

const WalletAddressForm: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [currentWalletAddress, setCurrentWalletAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchUserWallet = async () => {
      if (session?.user?.username) {
        try {
          const response = await fetch(`http://localhost:3001/api/user/${session.user.username}`);
          if (response.ok) {
            const userData = await response.json();
            if (userData.walletAddress) {
              setCurrentWalletAddress(userData.walletAddress);
            }
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserWallet();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user?.username) {
      try {
        const response = await fetch('http://localhost:3001/api/update-wallet', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: session.user.username,
            walletAddress,
          }),
        });

        if (response.ok) {
          console.log('Wallet address updated successfully');
          setCurrentWalletAddress(walletAddress);
          setWalletAddress('');
          setIsEditing(false);
          redirect(router, '/');
        } else {
          console.error('Failed to update wallet address');
        }
      } catch (error) {
        console.error('Error updating wallet address:', error);
      }
    }
  };

  return (
    <div className="wallet-address-form">
      {session?.user && (
        <div className="user-info">
          <h2 className="user-details-heading">User Details</h2>
          {session.user.image && (
            <img
              src={session.user.image}
              alt={`${session.user.name || session.user.username}'s profile picture`}
              className="user-image"
            />
          )}
          <p className="user-name">Name: {session.user.name || 'N/A'}</p>
          <p className="user-username">Username: {session.user.username}</p>
          <p className="user-wallet-address">
            Current Wallet Address: {currentWalletAddress || 'N/A'}
          </p>
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edit Wallet Address
          </button>
        </div>
      )}
      {isEditing && (
        <form onSubmit={handleSubmit} className="update-wallet-form">
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter your new wallet address"
            required
            className="wallet-input"
          />
          <button type="submit" className="submit-button">
            Update Wallet Address
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default WalletAddressForm;
