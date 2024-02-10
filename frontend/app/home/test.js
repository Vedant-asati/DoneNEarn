
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers, formatEther } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";


export default function Test({ state }) {
    const provider = state.provider;
    const signer = state.signer;
    const contractWhite = state.contractWhite;
    const contractTodo = state.contractTodo;
    // const { provider, signer } = state;
    // console.log("both",provider,signer)
    async function getOWNER() {
        contractTodo.OWNER().then(r => console.log(r));
    }
    async function getBalance() {
        const blc = await provider.getBalance(signer);
        if (blc) console.log("Ac balance:", formatEther(blc), "Eth.");
    }
    async function SignUpFn(_pwd = "hello") {
        const { provider, signer,contractTodo } = state;
        contractTodo.SignUp(_pwd).then(() => { console.log("user signUp as worker requested") }).catch(error => {
            console.log("Error message:", error.message);
        })
    }
    async function GetCred() {
        const { provider, signer,contractTodo } = state;
        try {
            let myCred = await contractTodo.getLoginData();
            console.log("your credential:", myCred)
        } catch (error) {
            console.log(error);
            console.log("user not signed up")
        }
    }
    async function removeAcc() {
        console.log("jsr this is delete data");
        try {
            await contractTodo.remove();
            console.log("requested to delete")
        } catch (error) {
            console.log(error);
        }

    }
    async function setTODO() {
        // ONLY OWNER
        const { provider, signer, contractTodo } = state;
        try {
            await contractTodo.createTodo("jsr","this is first note");
            console.log("JSR! Task addition requested... Please wait...");
        } catch (error) {
            console.log(error);
        }
    }
    //////////////////////////////////
    ///////////////////////////////////
    const [inputValue, setInputValue] = useState('');
    const handleChange = (event) => {
        setInputValue(event.target.value);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Input value:', inputValue);
        await SignUpFn();
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
            <br /><br />
            <b>JSR</b> <br />
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                <label style={{ marginRight: '10px' }}>
                    Enter Password:
                    <input
                        type="password"
                        value={inputValue}
                        onChange={handleChange}
                        style={{ color: 'black', marginLeft: '10px' }}
                    />
                </label>
                <button type="submit" style={{ marginLeft: '10px' }}>Submit</button>
            </form>
            <div style={{ marginTop: '20px' }}>
                Some Functions:
                <button onClick={getOWNER} style={{ marginLeft: '10px' }}>getOWNER</button><br />
                <button onClick={getBalance} style={{ marginLeft: '10px' }}>getBalance</button><br />
                <button onClick={SignUpFn} style={{ marginLeft: '10px' }}>SignUp</button><br />
                <button onClick={removeAcc} style={{ marginLeft: '10px' }}>DeleteAcc</button>
                <button onClick={GetCred} style={{ marginLeft: '10px' }}>GetCred</button>
                <button onClick={setTODO} style={{ marginLeft: '10px' }}>setTODO</button>

            </div>
        </div>
    );
}