import axios from "axios";

export async function getCastsMentioningBot() {
  const res = await axios.get("https://api.neynar.com/v1/farcaster/casts", {
    headers: { api_key: process.env.NEYNAR_API_KEY },
    params: { mentions: process.env.BOT_FID },
  });
  return res.data.casts;
}

export async function replyToCast(castHash, text) {
  await axios.post("https://api.neynar.com/v1/farcaster/cast", {
    text,
    replyTo: castHash,
  }, {
    headers: { api_key: process.env.NEYNAR_API_KEY },
  });
}
