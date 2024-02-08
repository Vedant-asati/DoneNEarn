'use client';
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";
//
import Test from "./test";

//
import ContractWhitelist from "../../../backend/artifacts/contracts/Whitelist.sol/Whitelist.json"
import ContractSiyaNFT from "../../../backend/artifacts/contracts/SiyaNFT.sol/SiyaNFT.json"
const whitelistAddress = "0xefFa170262827AD3238Df8f24b0040AEe073C03E";
const abiWhitelist = ContractWhitelist.abi;
const abiSiyaNFT = ContractSiyaNFT.abi;


export default function Home() {
  const [state, setState] = useState({ provider: null, signer: null });
  const myAddress = "0x337c787D769109Fc47686ccf816281Ad26e610B6";
  const [hasProvider, setHasProvider] = useState(false);
  const initialState = [];
  const [wallet, setWallet] = useState(initialState);
  let signer = null;
  let provider;
  useEffect(() => {
    const getProvider = async () => {
      if (window.ethereum != null) {
        try {
          // provider = await detectEthereumProvider({ silent: true });
          provider = new ethers.BrowserProvider(window.ethereum);
          setHasProvider(Boolean(provider));
          console.log("this is provider:", provider);
          const signer = await provider.getSigner();
          console.log("this is signer:", signer);
          setState({ provider: provider, signer: signer });
        } catch (error) {
          console.log(error);
        }
      } else console.log("JSR!!! Connect Eth Wallet!");
    };
    getProvider();
  }, []);

  // Prompt users to connect to MetaMask
  const updateWallet = async (accounts) => {
    setWallet({ accounts });
  };
  const handleConnect = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    updateWallet(accounts);
  }; // metamask
  const getData = async () => {
    console.log("jsr");
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    // provider.getTransactionCount();
    const blc = await provider.getBalance(signer);
    console.log("blc", BigInt(blc));
    const w = blc.toLocaleString("en-us");
    console.log(w);
  };
  const handleContract = async () => {
    console.log("jsr contract handler");
    const {provider}=state;
    // provider = new ethers.BrowserProvider(window.ethereum);
    const contract1 = new Contract(whitelistAddress, abiWhitelist, provider);
    console.log(contract1);
    contract1.maxWhitelistedAddresses().then(r => console.log(r));
    const val = await contract1.whitelistedAddresses("0x337c787D769109Fc47686ccf816281Ad26e610B6");
    console.log(val)

  };
  return (
    <>
      <div>
        Jai Siyaram
        <button onClick={() => console.log("jsr")}>Connect</button>
      </div>
      <div>Injected Provider {hasProvider ? "DOES" : "DOES NOT"} Exist</div>
      {hasProvider && <button onClick={handleConnect}>Connect MetaMask</button>}
      {wallet.accounts && <div>Wallet Accounts: {wallet.accounts[0]}</div>}
      <div>
        <button onClick={getData}>getData</button><br />
        <button onClick={handleContract}>handleContract</button>
      </div>
      <Test state={state} />
    </>
  );
}
