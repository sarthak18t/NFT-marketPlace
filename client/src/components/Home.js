import React, { useEffect, useState } from "react";
import { readContract, writeContract } from "@wagmi/core";
import NFT from "../contractsData/NFT.json";
import NFT_add from "../contractsData/NFT-address.json";
import MarketPlace from "../contractsData/MarketPlace.json";
import MarketPlace_add from "../contractsData/MarketPlace-address.json";
import { ethers } from "ethers";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading,setLoading] = useState(true);
  const loadMarketPlaceItems = async () => {
    const itemcount = await readContract({
      address: MarketPlace_add.address,
      abi: MarketPlace.abi,
      functionName: "itemCount",
    });
    console.log(itemcount);
    let items = [];
    for (var i = 1; i <= itemcount; i++) {
      const item = await readContract({
        address: MarketPlace_add.address,
        abi: MarketPlace.abi,
        functionName: "items",
      });
      if(!item.sold){
        const uri = await readContract({
          address : NFT_add.address,
          abi : NFT.abi,
          args : [item.tokenId],
        })
        const response = await fetch(uri);
        const metadata = await response.json();
        const totalprice = await readContract({
          address: MarketPlace_add.address,
          abi: MarketPlace.abi,
          functionName: "getTotalPrice", 
          args :[item.itemId],
        })
        items.push({
          totalprice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setItems(items);
    setLoading(false);
  };
  const buyMarketItem = async(item)=>{
        const {hash} = await writeContract({
          address: MarketPlace_add.address,
          abi: MarketPlace.abi,
          functionName: "purchaseItem", 
          args :[item.itemId], 
          value : item.totalprice,
        })
        console.log(hash);
        loadMarketPlaceItems();
  }
  useEffect(() => {
    loadMarketPlaceItems();
  }, []);
  if(loading){
    return(
      <div>
        <h2>Loading ...</h2>
      </div>
    )
  }
  return(
  <div>
      {items.length>0?
      <div>
        {items.map((item,id)=>(
          <div key={id}>
            <img src = {item.image} alt='img'></img>
            <p>{item.name}</p>
            <p>{item.description}</p>
            <button onClick={buyMarketItem}>Buy for {ethers.formatEther(item.totalprice)} ETH</button>
          </div>
        ))}
      </div>:
      <div>
        <h2>No Assets Listed</h2>
      </div>
    }
  </div>
  )
};

export default Home;
