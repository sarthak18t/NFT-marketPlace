import React, { useState } from 'react'
import axios from 'axios'
import './create.css'
import NFT from "../contractsData/NFT.json";
import NFT_add from "../contractsData/NFT-address.json";
import MarketPlace from "../contractsData/MarketPlace.json";
import MarketPlace_add from "../contractsData/MarketPlace-address.json";
import {readContract,writeContract} from '@wagmi/core'
import { ethers } from 'ethers';
const Create = () => {
  const[file,setFile] = useState(null);
  const [image,setImage] = useState('');
  const [price,setPrice] = useState(null);
  const [description,setDescription] = useState('');
  const [name,setName] = useState('');

  const uploadToIpfs = async()=>{
    console.log(file);
      if(file){
        try {
          const formData = new FormData();
          formData.append("file",file);
          const resFile = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: formData,
            headers: {
              pinata_api_key: "287901f50fc1344c4b8e",
              pinata_secret_api_key: "a816cb476254eed5e4691460267e8ba1bdb9aa363bed6be1f44672666145df7b",
              "Content-Type": "multipart/form-data",
            },
          });
          if(resFile.data && resFile.data.IpfsHash){
            const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
            setImage(ImgHash);
            alert("Successfully image uploaded");
          }
          else{
            throw new Error("Invalid response data format");
          }
        } catch (error) {
          console.error("Error while uploading image:", error);
         alert("Unable to upload image: " + error.message);
        }
      }
  }
  const retriveFile = async (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    e.preventDefault();
  };

  const createNFT = async(e)=>{
    e.preventDefault();
    try {
      console.log('0')
      const uri = image;
      console.log('1')
      const {hash} = await writeContract({
          address : NFT_add.address,
          abi : NFT.abi,
          functionName : "mint",
          args : [uri],
      })
      console.log('2')
      const id = await readContract({
        address : NFT_add.address,
        abi : NFT.abi,
        functionName : "tokenId", 
      })
      console.log('3')
      const {hash : secondHash} = await writeContract({
        address : NFT_add.address,
        abi : NFT.abi,
        functionName : "setApprovalForAll",
        args : [MarketPlace_add.address,true],  
      })
      console.log('4')
      const listingPrice = ethers.parseEther(price);
      console.log('5')
      const {hash:thirdHash} = await writeContract({
        address : MarketPlace_add.address,
        abi : MarketPlace.abi,
        functionName : 'makeItem',
        args : [NFT_add.address,id,listingPrice]
      })
      console.log('6')
    } catch (error) {
      alert('ipfs uri upload error');
      console.log(error);
    }
  }
  return (
    <div className='create'>
       <form className="form">
        <div className='upload-img'>
        <label htmlFor="file-upload" className="choose">
          Choose Image 
        </label>
        <input
          type="file"
          name="data"
          id="file-upload"
          onChange={retriveFile}
        ></input>
        </div>
         <input
          type="text"
          required
          onChange={(e)=>setName(e.target.value)}
          placeholder='name'
        ></input>
         <button type="button" className="upload" disabled={!file} onClick={uploadToIpfs}>
          Upload to IPFS
        </button>
         <input
          type="text"
          required
          onChange={(e)=>setDescription(e.target.value)}
          placeholder='description'
        ></input>
         <input
          type="number"
          required
          onChange={(e)=>setPrice(e.target.value)}
          placeholder='price in ETH'
        ></input>
        <button className="upload" disabled={!file} onClick={createNFT}>
          Create and List NFT
        </button>
      </form>
    </div>
  )
}

export default Create
