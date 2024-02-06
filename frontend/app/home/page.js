'use client';
import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { Contract, ethers } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";
import ContractWhitelist from "../../../backend/artifacts/contracts/Whitelist.sol/Whitelist.json"
import ContractSiyaNFT from "../../../backend/artifacts/contracts/SiyaNFT.sol/SiyaNFT.json"
const abiWhitelist=ContractWhitelist.abi;
const abiSiyaNFT=ContractSiyaNFT.abi;


export default function Home() {

    // const rpcURL = process.env.REACT_APP_rpcURL1;
    const myAddress = '0x337c787D769109Fc47686ccf816281Ad26e610B6';
    const [hasProvider, setHasProvider] = useState(false)
    const initialState = []
    const [wallet, setWallet] = useState(initialState)
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
                } catch (error) {
                    console.log(error);
                }
            }
            else console.log("JSR!!! Connect Eth Wallet!")
        }
        getProvider()
    }, [])

    // Prompt users to connect to MetaMask
    const updateWallet = async (accounts) => {
        setWallet({ accounts });
    }
    const handleConnect = async () => {
        let accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        updateWallet(accounts);
    }// metamask
    const getData = async () => {
        console.log("jsr");
        provider = new ethers.BrowserProvider(window.ethereum);
        setHasProvider(Boolean(provider));
        const signer = await provider.getSigner();
        // signer.getTransactionCount().then(console.log)
        // let ans;
        // provider.getBalance(signer.address).then(r => { console.log(r); ans = r; }).catch(e => { console.log(e); ans = -1 });
        // Convert user-provided strings in ether to wei for a value
        // const blc = await provider.getBalance("ethers.eth")
        // console.log(blc)
        console.log(ethers)
        let eth = ethers.parseEther("1.0");
        console.log(eth)
        let feePerGas = ethers.parseUnits("4.5", "gwei")
        console.log(feePerGas)
        console.log(ethers.formatEther(eth))
        console.log(ethers.formatUnits(feePerGas, "gwei"))
        console.log("jsr done");
        let bytes = ethers.toUtf8Bytes("Jai Siyaram")
        const myHash = ethers.sha256(bytes);
        console.log(myHash);
        // return ans;
    }
    const sendEth = async (_amount) => {
        provider = new ethers.BrowserProvider(window.ethereum);
        setHasProvider(Boolean(provider));
        const signer = await provider.getSigner();
        // When sending a transaction, the value is in wei, so parseEther
        // converts ether to wei.
        let tx = await signer.sendTransaction({
            to: "ethers.eth",
            value: parseEther("1.0")
        });
        receipt = await tx.wait();
        console.log("receipt: ",receipt);
    }
    const interactWithContract = async () => {
        provider = new ethers.BrowserProvider(window.ethereum);
        setHasProvider(Boolean(provider));
        contract = new Contract('')
    }
    return (
        <>
            <div>
                Jai Siyaram
                <button onClick={() => console.log("jsr")}>Connect</button>
            </div>
            <div>Injected Provider {hasProvider ? 'DOES' : 'DOES NOT'} Exist</div>
            {hasProvider &&
                <button onClick={handleConnect}>Connect MetaMask</button>
            }
            {wallet.accounts &&
                <div>Wallet Accounts: {wallet.accounts[0]}</div>
            }
            <div>
                <button onClick={getData}>Get Data</button>
                <button onClick={()=>console.log(provider)}>Get Data</button>
            </div>
        </>
    )
}