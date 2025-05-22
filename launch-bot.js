import { Connection, Keypair, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import dotenv from "dotenv";
import { getCastsMentioningBot, replyToCast } from "./farcaster-api.js";

dotenv.config();

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const wallet = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY))
);

async function handleCast(cast) {
  const text = cast.text.trim();
  const parts = text.split(" ");
  if (parts[1] === "launch" && parts[2] === "token") {
    const name = parts[3];
    const symbol = parts[4];
    const supply = Number(parts[5]);

    const mint = await createMint(
      connection,
      wallet,
      wallet.publicKey,
      null,
      9 // decimals
    );

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mint,
      wallet.publicKey
    );

    await mintTo(
      connection,
      wallet,
      mint,
      tokenAccount.address,
      wallet.publicKey,
      supply * 10 ** 9
    );

    const explorer = `https://solscan.io/token/${mint.toBase58()}`;
    await replyToCast(cast.hash, `✅ Token ${symbol} deployed!\n${explorer}`);
  }
}

async function main() {
  const casts = await getCastsMentioningBot();
  for (const cast of casts) {
    await handleCast(cast);
  }
}

main();
