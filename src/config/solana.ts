import { clusterApiUrl, PublicKey } from '@solana/web3.js';

export const SOLANA_NETWORK = clusterApiUrl('devnet');
export const TOKEN_ADDRESS = new PublicKey('3MG75Skt3kM4rdYLKpL5xcadxTDL6jm4dHDj2vWAdDm6');
export const RECIPIENT_WALLET = new PublicKey('3MG75Skt3kM4rdYLKpL5xcadxTDL6jm4dHDj2vWAdDm6');
export const TOKENS_PER_PIXEL = 10;
export const CANVAS_SIZE = 1000;
export const PIXEL_SIZE = 1; // Set to 1 for true 1000x1000 pixel canvas