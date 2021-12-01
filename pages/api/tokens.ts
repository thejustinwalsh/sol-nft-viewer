// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as metaplex from '@metaplex/js';
import { MetadataData } from '@metaplex/js/lib/programs/metadata';
import { Connection, PublicKey } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = Array<{ 
  address: string,
  uri: string,
  data: unknown,
  metadata: {
    name: string,
    description: string,
    image: string,
    external_url: string,
    properties: {
      creators: Array<{
        address: string,
      }>
    }
  }
}>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { address, creator } = req.query;
  const connection = new Connection(
    process.env.RPC_URL || 'http://localhost:8899',
    "confirmed"
  );

  // Get a list of all tokens owned buy the token program
  const publicKey = new PublicKey(address);
  const response = await connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
  });

  // Get the metaplex metadata uri for each token
  let tokens = [];
  for (const val of response.value) {
    try {
      const { account } = val;
      const tokenAccount = account.data.parsed.info.mint;
      const metadataPDA = await metaplex.programs.metadata.Metadata.getPDA(tokenAccount);
      const mintAccInfo = await connection.getAccountInfo(metadataPDA) ?? undefined; // fetch account info 
      const metadata = metaplex.programs.metadata.Metadata.from(new metaplex.Account(tokenAccount, mintAccInfo));
      tokens.push({ address: tokenAccount, data: val, uri: metadata.data.data.uri});
    } catch (e) {
      continue;
    }
  }

  // Fetch all metadata
  const metadata = await Promise.all(tokens.map(token => fetch(token.uri).then(res => res.json())));
  tokens = tokens.map((token, i) => ({ ...token, metadata: metadata[i] }));
  
  // Filter by creator
  if (creator) tokens = tokens.filter(token => token.metadata.properties.creators.find(({ address }: { address: string }) => address === creator));
  
  res.status(200).json(tokens);
}
