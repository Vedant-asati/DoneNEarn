
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers, formatEther } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";


function CreateArea({ state }) {
    const [note, setNote] = useState({
        title: "",
        content: "",
        completed: false,
        claimed: false
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setNote(prevNote => {
            return {
                ...prevNote,
                [name]: value
            };
        });
    }

    async function submitNote(event) {
        event.preventDefault();
        // to backend
        await setTODO(note.title, note.content);
        // to frontend
        // props.onAdd(note);
        setNote({
            title: "",
            content: "",
            completed: false,
            claimed: false

        });
        console.log("JSR... Requested to Add Task.")
        // implement from contract
    }
    /////////////////////////////////////////////////
    async function setTODO(title, content) {
        // ONLY OWNER
        const { provider, signer, contractTodo } = state;
        try {
            await contractTodo.createTodo(title, content);
            console.log("JSR! Task addition requested... Please wait...");
        } catch (error) {
            console.log(error);
        }
    }
    //////////////////////////////////////////////////
    return (
        <div style={{ backgroundColor: 'black', color: 'white', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
            <form className="create-note">
                <input
                    name="title"
                    onChange={handleChange}
                    value={note.title}
                    placeholder="Title"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white background
                        color: 'white', // Text color
                        border: 'none', // No border
                        borderRadius: '5px', // Rounded corners
                        padding: '10px', // Padding
                        marginBottom: '10px' // Margin bottom
                    }}
                />
                <textarea
                    name="content"
                    onChange={handleChange}
                    value={note.content}
                    placeholder="Take a note..."
                    rows="3"
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white background
                        color: 'white', // Text color
                        border: 'none', // No border
                        borderRadius: '5px', // Rounded corners
                        padding: '10px', // Padding
                        marginBottom: '10px' // Margin bottom
                    }}
                />
                <button
                    onClick={submitNote}
                    style={{
                        background: 'blue', // Button background color
                        color: 'white', // Button text color
                        border: 'none', // No border
                        borderRadius: '5px', // Rounded corners
                        padding: '10px 20px', // Padding
                        cursor: 'pointer' // Pointer cursor
                    }}
                >
                    Add
                </button>
            </form>
        </div>
    );

}

export default CreateArea;
