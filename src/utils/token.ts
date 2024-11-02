import { 
  Connection, 
  PublicKey, 
  Transaction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getAccount,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import { TOKEN_ADDRESS, TOKENS_PER_PIXEL, RECIPIENT_WALLET } from '../config/solana';

export async function transferTokensForPixels(
  connection: Connection,
  wallet: { publicKey: PublicKey; signTransaction: (tx: Transaction) => Promise<Transaction> },
  pixelCount: number
): Promise<string> {
  if (!wallet.publicKey) throw new Error('Wallet not connected');

  try {
    // Get sender's token account
    const senderTokenAccount = await getAssociatedTokenAddress(
      TOKEN_ADDRESS,
      wallet.publicKey
    );

    // Get recipient's token account
    const recipientTokenAccount = await getAssociatedTokenAddress(
      TOKEN_ADDRESS,
      RECIPIENT_WALLET
    );

    const transaction = new Transaction();

    // Check if recipient token account exists
    try {
      await getAccount(connection, recipientTokenAccount);
    } catch (e) {
      // Create recipient token account if it doesn't exist
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          recipientTokenAccount,
          RECIPIENT_WALLET,
          TOKEN_ADDRESS
        )
      );
    }

    // Calculate token amount for pixels (considering decimals)
    const tokenAmount = pixelCount * TOKENS_PER_PIXEL * Math.pow(10, 9);

    // Add transfer instruction
    transaction.add(
      createTransferInstruction(
        senderTokenAccount,
        recipientTokenAccount,
        wallet.publicKey,
        tokenAmount
      )
    );

    // Get recent blockhash
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    // Sign and send transaction
    const signed = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);
    
    return signature;
  } catch (error) {
    console.error('Token transfer error:', error);
    throw error;
  }
}