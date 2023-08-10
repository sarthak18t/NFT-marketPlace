// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MarketPlace is ReentrancyGuard {
    address payable immutable public feeAccount;
    uint public immutable feePercent;
    uint public itemCount;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller  
    );
    // itemId -> Item
    mapping(uint => Item) public items;

    constructor(uint _feepercent){
        feeAccount = payable(msg.sender);
        feePercent = _feepercent;
    }

    function makeItem(IERC721 _nft, uint _tokenId ,uint _price) external nonReentrant{
        require(_price>0,"Price must be greater than zero");
        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        items[itemCount] = Item(itemCount, _nft, _tokenId, _price, payable(msg.sender), false);
        emit Offered(itemCount,address(_nft), _tokenId, _price, msg.sender);
    }
}