// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
contract NFT is ERC721URIStorage{
    uint public tokenId;
    constructor() ERC721("noName","NNE"){}
    function mint(string memory _tokenUri) public returns(uint){
        tokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenUri);
        return tokenId;
    }
}
