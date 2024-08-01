const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const upload = multer({
    limits: {
        fileSize: 1000000,
    }
})


const starton = axios.create({
	baseURL: "https://api.starton.com",
	headers: {
		"x-api-key": process.env.STARTON_API_KEY,
	},
})

app.post("/upload", upload.single("file"), async(req, res) => {

    let data = new FormData();
    const blob = new Blob([req.file.buffer],{type:req.file.mimetype});
    data.append("file",blob,{filename:req.file.originalname})
    data.append("isSync","true");

    async function uploadImageOnIpfs(){
        const ipfsImg = await starton.post("/v3/ipfs/file", data, {
            headers: { "Content-Type": `multipart/form-data; boundary=${data._boundary}` },
          })
          return ipfsImg.data;
    }

    async function uploadMetadataOnIpfs(imgCid){
        const metadataJson = {
            name: `A Wonderful NFT`,
            description: `Probably the most awesome NFT ever created !`,
            imageCid: imgCid,
        }
        const ipfsMetadata = await starton.post("/v3/ipfs/json", {
            name: "My NFT metadata Json",
            content: metadataJson,
            isSync: true,
        })
        return ipfsMetadata.data;
    }

    const SMART_CONTRACT_NETWORK=process.env.SMART_CONTRACT_NETWORK;
    const SMART_CONTRACT_ADDRESS=process.env.SMART_CONTRACT_ADDRESS;
    const WALLET_IMPORTED_ON_STARTON=process.env.WALLET_IMPORTED_ON_STARTON;
    async function mintNFT(receiverAddress,metadataCid){
        const nft = await starton.post(`/v3/smart-contract/${SMART_CONTRACT_NETWORK}/${SMART_CONTRACT_ADDRESS}/call`, {
            functionName: "mint",
            signerWallet: WALLET_IMPORTED_ON_STARTON,
            speed: "low",
            params: [receiverAddress, metadataCid],
        })
        return nft.data;
    }
    const RECEIVER_ADDRESS = "0x4653CeA34af4B3cF4B27C912A5BBEE015b9E7Fb0"
    const ipfsImgData = await uploadImageOnIpfs();
    const ipfsMetadata = await uploadMetadataOnIpfs(ipfsImgData.cid);
    const nft = await mintNFT(RECEIVER_ADDRESS,ipfsMetadata.cid)
    // console.log(nft.transactionHash);
    res.status(201).json({
        transactionHash:nft.transactionHash,
        cid:ipfsImgData.cid
    })
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})


