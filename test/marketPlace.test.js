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
        let result;
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

})