// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
contract NFT is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter public tokenId;
    constructor() ERC721("noName","NNE"){}
    function mint(string memory _tokenUri) public returns(uint){
        tokenId.increment();
        uint newtokenId = tokenId.current();
        _safeMint(msg.sender, newtokenId);
        _setTokenURI(newtokenId, _tokenUri);
        return newtokenId;
    }
}
