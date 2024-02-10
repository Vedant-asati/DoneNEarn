import React, { useState } from "react";

function CreateArea(props) {
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
        // to backend
        await setTODO(note.title,note.content);
        // to frontend
        props.onAdd(note);
        setNote({
            title: "",
            content: "",
            completed: false,
            claimed: false

        });
        event.preventDefault();
        console.log("JSR... Requested to Add Task.")
        // implement from contract
    }
    /////////////////////////////////////////////////
    async function setTODO() {
        // ONLY OWNER
        const { provider, signer } = state;
        try {
            const contract2 = new Contract(TodoListAddress, abiTodoList, signer);
            await contract2.createTodo("jsr","this is first note");
            console.log("JSR! Task addition requested... Please wait...");
        } catch (error) {
            console.log(error);
        }
    }

    //////////////////////////////////////////////////
    return (
        <div>
            <form className="create-note">
                <input
                    name="title"
                    onChange={handleChange}
                    value={note.title}
                    placeholder="Title"
                />
                <textarea
                    name="content"
                    onChange={handleChange}
                    value={note.content}
                    placeholder="Take a note..."
                    rows="3"
                />
                <button onClick={submitNote}>Add</button>
            </form>
        </div>
    );
}

export default CreateArea;
