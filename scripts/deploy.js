const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account : ",await deployer.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const marketPlace = await hre.ethers.getContractFactory("MarketPlace");

  const nft = await NFT.deploy();
  const marketplace = await marketPlace.deploy(1);

  console.log("NFT contract is deployed on address ",await nft.getAddress());
  console.log("MarketPlace contract is deployed on address ",await marketplace.getAddress());
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
