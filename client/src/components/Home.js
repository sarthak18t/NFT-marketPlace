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

    let items = [];
    for (var i = 1; i <= itemcount; i++) {
      console.log('1')
      const item = await readContract({
        address: MarketPlace_add.address,
        abi: MarketPlace.abi,
        functionName: "items",
        args : [i],
      });
      console.log('2')
      if(!item.sold){
        const tokenID = item[2];
        console.log(tokenID,"sd")
        const uri = await readContract({
          address : NFT_add.address,
          abi : NFT.abi,
          functionName : "tokenURI",
          args : [tokenID],
        })
        console.log('3')
        console.log(uri)
        // const response = await fetch(uri);
        // console.log(response)
        // console.log('4')
        // console.log(item[0])
  
        // const metadata = await response.json();
        // console.log(metadata)
        const totalprice = await readContract({
          address: MarketPlace_add.address,
          abi: MarketPlace.abi,
          functionName: "getTotalPrice", 
          args :[item[0]],
        })
        console.log('5')
        items.push({
          totalprice,
          itemId: item.itemId,
          seller: item.seller,
          // name: metadata.name,
          // description: metadata.description,
          // image: metadata.image
        })
        console.log('6')
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
