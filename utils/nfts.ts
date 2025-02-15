import { Metaplex, PublicKey, toMetaplexFileFromBrowser } from "@metaplex-foundation/js";

export async function mintNFT(metaplex: Metaplex, name: string, description: string, image: any) {
    try {
        // Upload MetaData
        const { uri, metadata } = await metaplex
            .nfts()
            .uploadMetadata({
                name,
                description,
                image: await toMetaplexFileFromBrowser(image)
            });

        // Mint NFT
        const nft = await metaplex
            .nfts()
            .create({
                uri,
                name,
                sellerFeeBasisPoints: 10000,
            });
        return nft;
    } catch (e) {
        throw e;
    }
}


export async function getAllNftsByOwner(metaplex: Metaplex) {
    const nfts: any = []
    const owner = metaplex.identity().publicKey;
    if (owner) {
        const data = await metaplex.nfts()
            .findAllByOwner({ owner })/*  */
        for (let d of data) {
            const metadata = await (await fetch(d.uri)).json();
            nfts.push(metadata);
        }
    }
    
    return nfts;
}