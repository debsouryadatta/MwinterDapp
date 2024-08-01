### Steps of Dev:
1. Setting up the Starton Platform to deploy a ERC721 template of smart contract which will be used to create a new NFTs.

2. Faced a lot of issues in deploying to the Polygon Test Network so switched to ultimately deploying it to the sepolia test network(Using the Starton wallet).

3. Creating both the client(React) and the api(Nodejs) folders, `pnpm i express multer cors axios` in the api folder

4. Setting up the server.js and writing 2 functions on the "/upload" endpoint -> uploadImageOnIpfs() & uploadMetadataOnIpfs() funcs.

5. Wrinting another mintNFT() function -> To create/mint a new NFT using the ERC721 smart contract template deployed on the sepolia test network(Fully done by the Starton platform). Just returning the transactionHash & the cid as a json response. All the three functions are called inside just one endpoint "/upload".

6. In the frontend, we created a FileUpload component where we wrote 2 funcs - retreieveFile() -> to get the file and handleSubmit() -> to call the "/upload" endpoint and get the transactionHash & cid.

7. After getting/setting both the transactionHash & cid, we used them to show in the UI