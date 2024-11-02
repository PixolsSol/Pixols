import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletButton: FC = () => {
  const { publicKey } = useWallet();

  return (
    <div className="flex items-center gap-4">
      {publicKey && (
        <span className="text-sm text-gray-400">
          {publicKey.toString().slice(0, 4)}...
          {publicKey.toString().slice(-4)}
        </span>
      )}
      <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />
    </div>
  );
};