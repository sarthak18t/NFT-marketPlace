const {expect} = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.parseEther(num.toString())
const fromWei = (num) => ethers.formatEther(num)

describe ("NFT marketplace",()=>{
    let nftContract;
    let nft;
    let marketPlaceContract;
    let marketplace;
    let feePercent = 1;
    let URI ="Sample test";
    beforeEach(async()=>{
        nftContract = await ethers.getContractFactory("NFT");
        marketPlaceContract = await ethers.getContractFactory("MarketPlace");
        [deployer,addr1,addr2] = await ethers.getSigners();

        nft = await nftContract.deploy();
        marketplace = await marketPlaceContract.deploy(feePercent);
    })

    describe("Deployment",()=>{
        it("Should track name and symbol of nft collection",async()=>{
            const name = "noName";
            const symbol = "NNE";
            expect(await nft.name()).to.equal(name);
            expect(await nft.symbol()).to.equal(symbol);
        })
        it("Should track feeAccount and feePercent of MarketPlace",async()=>{
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
            expect(await marketplace.feePercent()).to.equal(feePercent);
        })
    })

    describe("Minting NFT",()=>{
        it("Should track each minted NFT",async()=>{
            await nft.connect(addr1).mint(URI);
            expect(await nft.tokenId()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);

            await nft.connect(addr2).mint(URI)
            expect(await nft.tokenId()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        })
    })

    describe("Making marketPlace item",async()=>{
        let price = 1;
        beforeEach(async()=>{
            await nft.connect(addr1).mint(URI);
            await nft.connect(addr1).setApprovalForAll(marketplace,true);
        })
        it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event",async()=>{
            expect(await marketplace.connect(addr1).makeItem(nft,1,toWei(price)))
            .to.emit(marketplace,"Offered")
            .withArgs(1,nft.address,1,toWei(price),addr1.address)
            expect(await nft.ownerOf(1)).to.equal(await marketplace.getAddress());
            expect(await marketplace.itemCount()).to.equal(1)
            const item = await marketplace.items(1)
            expect(item.itemId).to.equal(1)
            expect(item.nft).to.equal(await nft.getAddress())
            expect(item.tokenId).to.equal(1)
            expect(item.price).to.equal(toWei(price))
            expect(item.sold).to.equal(false)
        })
        it("Should fail if price is set to zero", async function () {
            await expect(
              marketplace.connect(addr1).makeItem(nft, 1, 0)
            ).to.be.revertedWith("Price must be greater than zero");
          })
    })
    describe("Purchasing marketPlace item",()=>{
        let price = 2;
        let fee = (feePercent/100)*price;
        let totalPriceInWei;
        beforeEach(async()=>{
            await nft.connect(addr1).mint(URI);
            await nft.connect(addr1).setApprovalForAll(marketplace,true);
            await marketplace.connect(addr1).makeItem(nft,1,toWei(price));
        })
        it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event",async()=>{
            const sellerInitBalEth = await addr1.balance;
            const feeAccountInitBalEth = await deployer.balance;

            totalPriceInWei = await marketplace.getTotalPrice(1);
            expect(await marketplace.connect(addr2).purchaseItem(1,{value : totalPriceInWei}))
            .to.emit(marketplace,"Bought")
            .withArgs( 1,nft.address, 1, toWei(price),addr1.address,addr2.address)

            const sellerFinalBalEth = await addr1.balance;
            const feeAccountFinalBalEth = await deployer.balance;
            
            expect((await marketplace.items(1)).sold).to.equal(true);
        })
        it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {
            // fails for invalid item ids
            await expect(
              marketplace.connect(addr2).purchaseItem(2, {value: totalPriceInWei})
            ).to.be.revertedWith("item doesn't exist");
            await expect(
              marketplace.connect(addr2).purchaseItem(0, {value: totalPriceInWei})
            ).to.be.revertedWith("item doesn't exist");
            // Fails when not enough ether is paid with the transaction. 
            // In this instance, fails when buyer only sends enough ether to cover the price of the nft
            // not the additional market fee.
            await expect(
              marketplace.connect(addr2).purchaseItem(1, {value: toWei(price)})
            ).to.be.revertedWith("not enough ether to cover item price and market fee"); 
            // addr2 purchases item 1
            await marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei})
            // addr3 tries purchasing item 1 after its been sold 
            const addr3 = addrs[0]
            await expect(
              marketplace.connect(addr3).purchaseItem(1, {value: totalPriceInWei})
            ).to.be.revertedWith("item already sold");
          });
    })
})