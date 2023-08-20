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
  saveFrontendFiles(marketplace , "MarketPlace");
  saveFrontendFiles(nft , "NFT");
}
 function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../client/src/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.target }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}
main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
