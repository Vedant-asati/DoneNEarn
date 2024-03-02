import { useState, useEffect, useRef } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers, formatEther } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";
import { MetaMaskProvider } from "@metamask/sdk-react";

const e_abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "message",
                "type": "string"
            }
        ],
        "name": "cnf_SignUp",
        "type": "event"
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
        "name": "eligible",
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
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "noOfTasksDone",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "remove",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const e_address = "0xd5e5679bBd5e8dE52b3a1958b87FF251Cab0CF48";
export default function Test2({ state }) {
    const provider = state.provider;
    const signer = state.signer;
    const contractWhite = state.contractWhite;
    const contractTodo = state.contractTodo;
    const contractRef = useRef(null); // Use a ref to store the contract instance

    // console.log("both", provider, signer, contractTodo)
    async function getOWNER() {
        contractTodo.OWNER().then(r => console.log(r));
    }
    const [contract, setContract] = useState(null);

    useEffect(() => {
        if (state.signer) {
            console.log("signer:", state.signer)
            const contractInstance = new Contract(e_address, e_abi, state.signer);
            setContract(contractInstance);
            console.log("contractinst:", contractInstance);

            // Only subscribe if the contract instance has not been set yet
            if (!contractRef.current) {
                contractRef.current = contractInstance;
                // Subscribe to the 'cnf_SignUp' event
                contractInstance.on('cnf_SignUp', (sender, message, event) => {
                    console.log(" ");
                    console.log('Event received:');
                    console.log('Sender:', sender);
                    console.log('Message:', message);
                    console.log('Event:', event);
                    console.log(" ");
                    console.log("User Signed Up successfully...");
                });
            };
        };
        // Cleanup function to unsubscribe from events when component unmounts
        return () => {
            if (contract) {
                contract.removeAllListeners('cnf_SignUp');
            }
        };
    }, [state]);
    // async function SignUpFn() {
    //     try {
    //         await contract.SignUp("_pwd");
    //         console.log("user signUp as worker requested... wait for confirmation...");
    //     } catch (error) {
    //         if (error.message.includes("JSR! You are the boss!!")) {
    //             console.log("JSR! You are the owner of the contract and cannot sign up.");
    //         } else {
    //             console.log("Error message:", error.message);
    //         }
    //     }
    // }
    async function SignUpFn() {
        try {
            // window.ethereum.on('error', (error) => {
            //     console.error("MetaMask error:", error);
            // });
            const gasEstimate = await contract.SignUp.estimateGas("_pwd");
            await contract.SignUp("_pwd");
            console.log("user signUp as worker requested... wait for confirmation...");
        } catch (error) {
            if (ethers.isError(error, "CALL_EXCEPTION")) {
                // console.log(error)
                // const revertReason = ethers.decodeBytes32String(error.data.toString());
                if (error.reason === "JSR! You are the boss!!") {
                    console.log("JSR! You are the owner of the contract and cannot sign up.");
                } else {
                    console.log("Error message:", error.reason);
                }
            } else {
                console.log("Error message:", error.message);
            }
        }
    }


    return (
        <div>
            <br /><br />
            <button onClick={SignUpFn}>signuptest(event_auth)</button>
            <br /><br /><br /><br />
        </div>
    );
}