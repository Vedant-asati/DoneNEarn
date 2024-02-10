'use client';
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";
//
import Test from "./test";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreateArea from "./components/createarea";
//
import ContractWhitelist from "../../../backend/artifacts/contracts/Whitelist.sol/Whitelist.json"
import ContractSiyaNFT from "../../../backend/artifacts/contracts/SiyaNFT.sol/SiyaNFT.json"
const whitelistAddress = "0xefFa170262827AD3238Df8f24b0040AEe073C03E";
const TodoListAddress = "0x096D9aC7A8bb03e90B8b28b74383A68437D53499";
const abiWhitelist = ContractWhitelist.abi;
const abiSiyaNFT = ContractSiyaNFT.abi;
const abiTodoList = [
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "inputs": [],
      "name": "AuthInstance",
      "outputs": [
          {
              "internalType": "contract Authenticator",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "OWNER",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "string",
              "name": "_pwd",
              "type": "string"
          }
      ],
      "name": "SignUp",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "WhiteContractAdd",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "WhiteInstance",
      "outputs": [
          {
              "internalType": "contract Whitelist",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "_index",
              "type": "uint256"
          }
      ],
      "name": "claim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "string",
              "name": "_title",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "_text",
              "type": "string"
          }
      ],
      "name": "createTodo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "_index",
              "type": "uint256"
          }
      ],
      "name": "deleteTodo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "getLoginData",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "locked",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "_index",
              "type": "uint256"
          }
      ],
      "name": "markCompleted",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "remove",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "name": "todos",
      "outputs": [
          {
              "internalType": "string",
              "name": "title",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "text",
              "type": "string"
          },
          {
              "internalType": "bool",
              "name": "completed",
              "type": "bool"
          },
          {
              "internalType": "bool",
              "name": "claimed",
              "type": "bool"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  }
];

export default function Home() {
  const [state, setState] = useState({ provider: null, signer: null, contractWhite: null,contractTodo:null });
  const [hasProvider, setHasProvider] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const myAddress = "0x337c787D769109Fc47686ccf816281Ad26e610B6";
  const [wallet, setWallet] = useState([]);
  let signer = null;
  let provider;
  useEffect(() => {
    const getProvider = async () => {
      if (window.ethereum != null) {
        try {
          // provider = await detectEthereumProvider({ silent: true });
          provider = new ethers.BrowserProvider(window.ethereum);
          setHasProvider(Boolean(provider));
          const signer = await provider.getSigner();
          const contract1 = new Contract(whitelistAddress, abiWhitelist, provider);
          const contract2 = new Contract(TodoListAddress, abiTodoList, signer);
          console.log("this is provider:", provider);
          console.log("this is signer:", signer);
          // console.log("this is contract:", contract1);
          setState({ provider: provider, signer: signer, contractWhite: contract1,contractTodo: contract2 });
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
    if (wallet.accounts) {
      setShowAccounts(!showAccounts);
      return;
    }
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
    const { provider } = state;
    // provider = new ethers.BrowserProvider(window.ethereum);
    const contract1 = new Contract(whitelistAddress, abiWhitelist, provider);
    console.log(contract1);
    contract1.maxWhitelistedAddresses().then(r => console.log(r));
    const val = await contract1.whitelistedAddresses("0x337c787D769109Fc47686ccf816281Ad26e610B6");
    console.log(val)

  };
  return (
    <>
      <Header />
      <div>JSR</div>
      <div>Injected Provider {hasProvider ? "DOES" : "DOES NOT"} Exist</div>
      {hasProvider && <button onClick={handleConnect}>Show Address</button>}
      {showAccounts && wallet.accounts && <div>{wallet.accounts[0]}</div>}
      {/*  */}
      <CreateArea state={state}/>
      <Test state={state} />
      {/* <Footer /> */}
    </>
  );
}
