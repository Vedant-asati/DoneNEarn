import { useState, useEffect, useRef } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers, formatEther } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";
import { MetaMaskProvider } from "@metamask/sdk-react";
import e_abi from "./e_abi";

// const e_abi = e_abi;
const e_address = "0xC124C3C27340467a8124c8a7a3bcf63416cdF3E6";
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
                contractInstance.on('cnf_SignUp', (sender, message, event) => {
                    console.log(" ");
                    console.log('SignUp Event received:');
                    console.log('Sender:', sender);
                    console.log('Message:', message);
                    console.log('Event:', event);
                    console.log("User Signed Up successfully...");
                });
                // struct TodoItem {
                //     string title;
                //     string text;
                //     bool completed;
                //     bool claimed;
                // }
                contractInstance.on('cnf_NewTask', (sender, todo, event) => {
                    console.log(" ");
                    console.log('NewTask Event received:');
                    console.log('Sender:', sender);
                    console.log('Task:', todo);
                    console.log('Event:', event);
                    console.log("New Task Created...");
                });
                contractInstance.on('cnf_DeleteTask', (sender, todo, event) => {
                    console.log(" ");
                    console.log('DeleteTask Event received:');
                    console.log('Sender:', sender);
                    console.log('Task:', todo);
                    console.log('Event:', event);
                    console.log("Task Deleted successfully...");
                });
                contractInstance.on('cnf_TaskDone', (sender, todo, event) => {
                    console.log(" ");
                    console.log('cnf_TaskDone Event received:');
                    console.log('Sender:', sender);
                    console.log('Task:', todo);
                    console.log('Event:', event);
                    console.log("Task Completed successfully...");
                });
                contractInstance.on('cnf_TaskClaimed', (sender, todo, event) => {
                    console.log(" ");
                    console.log('cnf_TaskClaimed Event received:');
                    console.log('Sender:', sender);
                    console.log('Task:', todo);
                    console.log('Event:', event);
                    console.log("Task Claimed successfully...");
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
    async function SignUpFn() {
        try {
            const gasEstimate = await contract.SignUp.estimateGas("_pwd");
            await contract.SignUp("_pwd");
            console.log("user signUp as worker requested... wait for confirmation...");
        } catch (error) {
            if (ethers.isError(error, "CALL_EXCEPTION")) {
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
            <button onClick={SignUpFn}>signuptest(event_todo)</button>
            <br /><br /><br /><br />
        </div>
    );
}