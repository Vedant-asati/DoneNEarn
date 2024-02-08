import { useState } from "react";

export default function Test({state}) {
    console.log("state",state);
    const provider = state.provider;
    const signer = state.signer;
    // console.log("both",provider,signer)
    async function handleClick(){
        const blc = await provider.getBalance(signer);
        console.log("blc", BigInt(blc));
        const w = blc.toLocaleString("en-us");
        console.log(w);
    }

    return (
        <div>
            <br/><br/>
            jai siyaram!!! <br/>
            thsi is test...
            <button onClick={handleClick}>ClickME</button>

        </div>
    );
}