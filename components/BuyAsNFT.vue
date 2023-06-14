<script setup>
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { MetaMaskWallet } from "@thirdweb-dev/wallets"

const config = useRuntimeConfig()
const props = defineProps(['image', 'name', 'desc'])
const message = ref("")
const wallet = new MetaMaskWallet()

const buy = async () => {  

    message.value = "connecting to wallet..."

    wallet.on("connect", () => {
        console.log("connected")
    });

    wallet.on("error", () => {
        console.log("error")
    })

    wallet.on("message", (e) => {
        console.log(e)
    })

    wallet.on("change", () => {
        console.log("change")
    })

    await wallet.connect({chainId: config.nftchain}).catch((e) => {
        message.value = e;
        console.log(e)
    });
    console.log(wallet)

    const sdk = await ThirdwebSDK.fromWallet(wallet).catch((e) => {
        message.value = e
        console.log(e)
    })

    const signer = await wallet.getSigner();
    console.log(signer)

    const address = await signer.getAddress();
    console.log(address)
    
    const contract = config.public.nftcontract;
    const collection = await sdk.getContract(contract).catch((e) => {
        message.value = e
        console.log(e)
    });

    message.value = "generating signature..."
    
    const signedPayloadReq = await fetch('/api/nft/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            address: address,
            image: props.image,
            name: props.name,
            desc: props.desc,
        })
    }).catch((e) => {
        message.value = e;
        console.log(e)
    });

    const json = await signedPayloadReq.json()
    if (json.error) {
        message.value = json.message
    } else {
        const signedPayload = json.signedPayload;
        console.log(signedPayload)
        message.value = "minting NFT"

        const balance = await sdk.wallet.balance();
        if (parseFloat(balance.displayValue) < parseFloat(signedPayload.payload.price)) {
            message.value = "Not enough funds to buy NFT! Price is " + signedPayload.payload.price + " ETH!"
            return
        }

        const nft = await collection.erc721.signature.mint(signedPayload).catch((e) => {
            message.value = "ERROR: Could not mint NFT" + e;
            console.log(e)
        })
    
        if(nft) {
            console.log(nft)
            message.value = "Thank you for your shopping with us! Have a nice day!"           
        } else {
            message.value = "ERROR: Could not mint NFT";
        }
    }    
}
</script>

<template>
    <div>
      <button @click="buy"> 
          Buy NFT
      </button>
    </div>
    <div>
      {{ message }}
    </div>
</template>
