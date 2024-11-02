import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { TOKEN_ADDRESS } from '../config/solana';

interface TokenBalance {
  balance: number;
  loading: boolean;
  error: string | null;
}

export const useTokenBalance = (): TokenBalance => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [state, setState] = useState<TokenBalance>({
    balance: 0,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!publicKey) {
      setState({ balance: 0, loading: false, error: null });
      return;
    }

    let mounted = true;

    const fetchBalance = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const associatedTokenAddress = await getAssociatedTokenAddress(
          TOKEN_ADDRESS,
          publicKey
        );

        try {
          const account = await getAccount(connection, associatedTokenAddress);
          
          if (mounted) {
            setState({
              // Convert from base units to actual token amount
              balance: Number(account.amount) / Math.pow(10, 9),
              loading: false,
              error: null,
            });
          }
        } catch (e: any) {
          // If account doesn't exist, balance is 0
          if (e.name === 'TokenAccountNotFoundError') {
            if (mounted) {
              setState({
                balance: 0,
                loading: false,
                error: null,
              });
            }
          } else {
            throw e;
          }
        }
      } catch (error) {
        console.error('Error fetching token balance:', error);
        if (!mounted) return;
        setState({
          balance: 0,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch balance',
        });
      }
    };

    fetchBalance();
    
    // Set up account subscription
    const subscriptionId = connection.onAccountChange(
      publicKey,
      () => {
        fetchBalance();
      },
      'confirmed'
    );

    return () => {
      mounted = false;
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, publicKey]);

  return state;
};