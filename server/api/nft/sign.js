import { ThirdwebSDK } from '@thirdweb-dev/sdk'


export default defineEventHandler(async (event) => {
    try {
        // console.log('New request: ' + getRequestURL(event))
        const config = useRuntimeConfig()
        const query = getQuery(event)
        const body = await readBody(event)
        const { address, image, name, desc } = body;

        const sdk = ThirdwebSDK.fromPrivateKey(config.ETH_PRIVATE_KEY, "goerli");  
        const collection = await sdk.getContract(config.public.nftcontract);
        
        const signedPayload = await collection.erc721.signature.generate({
            to: address,
            metadata: {
                name: name || "just a test",
                description: desc || "just a test",
                image: image
            },
            price: 0.00001,
        })
        // Return the signature
        return {
            signedPayload,
            }
    } catch (err) {
        // Return an error if something goes wrong
        console.log(err)
        return {
            message: "Internal server error",
            error: true,
        }
    }
  })
