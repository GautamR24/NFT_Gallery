
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { NftCard } from './components/NftCard';
import { useEffect } from 'react'
require("dotenv");
// require('dotenv').config({ path: require('find-config')('.env') });



const Home = () => {
  /**
   * @dev wallet and collection here are the state variables whose value will be set by the corresponding functions
   */
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [nfts, setNfts] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  /**
   * testing for pagenation
   */
  const [pages, setPages] = useState(0);
  const [loadPage, setLoadPage] = useState(1);
  const [nftChunk, setNftChunk] = useState([]);

  /**
   * @dev this function will fetch the nft owned information based on the values passed by the user. If only wallet address is passed then all nfts owned by that
   * address will fetched. If the collection address is also given the nfts of that collection owned by the wallet will be fetched.
   */
  const fetchNfts = async () => {
    let nfts;
    console.log("fetching the nfts");
    const api = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    console.log("This is the api key", api);
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api}/getNFTs/`;


    if (!collection) {
      // Setup request options:
      var requestOptions = {
        method: 'GET'
      };

      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    }
    else {
      console.log("Fetching nft collections");
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    }
    /**
     *@dev this will output the nfts array fetched in the previous block.
     */
    if (nfts) {
      console.log("This is nft owned by the person", nfts);
      setNfts(nfts.ownedNfts);
      /**
       * testing the pagenation
       */
      setPages(0);
      setLoadPage(1);
    }


  }

  const fetchNftsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const api = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
      const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${api}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
      /**
       * testing for pagenation
       */
      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNfts(nfts.nfts);
        setPages(0);
        setLoadPage(1);
      }
      // if (nfts) {
      //   console.log("NFTs in collection", nfts);
      //   setNfts(nfts.nfts);
      // }
    }
  }

  useEffect(() => {
    const loadSelectedPageData = (page) => {
      console.log("-----------loadSelectedPageData--------------");
      let start = (page - 1) * 10;
      let end = start + 9;
      let nftChunk = nfts.slice(start, end);
      console.log("This is the nfts data under useEffect",nftChunk);
      console.log('----NFTS:', nfts)
      console.log('----nftChunk:', nftChunk)
      setNftChunk(nftChunk);
      setPages(Math.ceil(nfts.length / 10));
    }
    loadSelectedPageData(loadPage);
  }, [nfts, loadPage]);

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchForCollection} className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg  text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setWalletAddress(e.target.value) }} value={wallet} type="text" placeholder='Add  your wallet address' />
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg  text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setCollectionAddress(e.target.value) }} value={collection} type="text" placeholder='Add the collection address' />
        <label className="text-gray-600"><input onChange={(e) => { setFetchForCollection(e.target.checked) }} type="checkbox" className="mr-2" />Fetch for the collection</label>
        <button className="diabled:bg-state-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5" onClick={
          () => {
            if (fetchForCollection) {
              fetchNftsForCollection();
            }
            else {
              fetchNfts();
            }
          }
        }>Search</button>

      </div>
      <div className="flex flex-wrap gap-y-1/2 mt-4 w-5/4 gap-x-2 justify-center">
        {
          nftChunk.length && nftChunk.map((nft, i) => {
            return (
              <NftCard key={i} nft={nft}></NftCard>
            )
          })
        }
      </div>
      {/* testing for pagenation */}
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          pages > 0 && (
            [...Array(pages)].map((elementInArray, index) => (
              (index + 1) == loadPage ? (
                <button className={"text-white bg-red-400 px-3 py-1 mt-1"} key={index} onClick={() => { setLoadPage(index + 1) }}>{index + 1}</button>
              ) : (
                <button className={"text-white bg-blue-400 px-3 py-1 mt-1"} key={index} onClick={() => { setLoadPage(index + 1) }}>{index + 1}</button>
              )
            ))
          )
        }
      </div>
    </div>

  )
}

export default Home
