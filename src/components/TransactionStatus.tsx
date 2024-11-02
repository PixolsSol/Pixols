import { FC } from 'react';

interface TransactionStatusProps {
  status: {
    status: 'pending' | 'success' | 'error' | null;
    message: string;
  };
}

export const TransactionStatus: FC<TransactionStatusProps> = ({ status }) => {
  if (!status.status) return null;

  const bgColor = {
    pending: 'bg-yellow-900',
    success: 'bg-green-900',
    error: 'bg-red-900'
  }[status.status];

  const textColor = {
    pending: 'text-yellow-200',
    success: 'text-green-200',
    error: 'text-red-200'
  }[status.status];

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg ${bgColor} ${textColor} shadow-xl`}>
      {status.message}
    </div>
  );
};