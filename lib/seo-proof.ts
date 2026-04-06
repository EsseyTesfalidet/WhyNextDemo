export type SeoProofPayload = {
  phrase: string;
  generatedAt: string;
};

const SEO_PHRASE = 'OSU Next.js SEO Proof: Buckeye Learning Portal Indexable Content';

export async function getSeoProofFromServer(): Promise<SeoProofPayload> {
  return {
    phrase: SEO_PHRASE,
    generatedAt: new Date().toISOString()
  };
}
