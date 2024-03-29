// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./Authenticator.sol";
import "./Whitelist.sol";

interface IWhitelist {
    function maxWhitelistedAddresses() external view returns (uint8);
    function whitelistedAddresses(address) external view returns (bool);
    function numAddressesWhitelisted() external view returns (uint8);
    function addAddressToWhitelist() external;
}


contract TodoList is Authenticator {
    address public immutable WhiteContractAdd=0xefFa170262827AD3238Df8f24b0040AEe073C03E;
    Authenticator public AuthInstance;
    Whitelist public WhiteInstance;
    constructor() {
        AuthInstance = new Authenticator();
        WhiteInstance = new Whitelist(10);
        // WhiteInstance = new Whitelist(10);
    }
    struct TodoItem {
        string title;
        string text;
        bool completed;
        bool claimed;
    }
    TodoItem[] public todos;

    event cnf_NewTask(address indexed sender, TodoItem todo);
    event cnf_DeleteTask(address indexed sender, TodoItem todo);
    event cnf_TaskDone(address indexed sender, TodoItem todo);
    event cnf_TaskClaimed(address indexed sender, TodoItem todo);

    function createTodo(string memory _title,string memory _text) public onlyOWNER {
        // only owner
        todos.push(TodoItem(_title,_text, false,false));
        emit cnf_NewTask(msg.sender,TodoItem(_title,_text, false,false));
    }
    function deleteTodo(uint _index) public onlyOWNER {
        // only owner... just for now
        // can be sorted using timestamp... deletion in O(1).
        require(_index < todos.length, "jsr!! Index out of bound");
        require(todos[_index].claimed==true , "jsr!! Unclaimed cant be deleted");
        TodoItem memory toBeDeleted = todos[_index];
        for (uint i = _index; i < todos.length - 1; i++) {
            todos[i] = todos[i + 1];
        }
        todos.pop();
        emit cnf_DeleteTask(msg.sender,toBeDeleted);
    }
    function markCompleted(uint _index) public  onlyWorker {
        require(todos[_index].completed==false,"jsr! cant resubmit same work.");
        todos[_index].completed = true;
        // doTask();
        emit cnf_TaskDone(msg.sender,todos[_index]);
    }
    function claim(uint _index) public noReentrancy onlyWorker {
        require(todos[_index].claimed==false,"jsr! cant reclaim for same work.");
        require(todos[_index].completed==true,"jsr! please do the work first.");

        // whitelist and buy()
        // ICounter(_counter).increment();
        IWhitelist(WhiteContractAdd).addAddressToWhitelist();
        // JSR claimed!!
        // todos[_index].claimed=true;
        emit cnf_TaskClaimed(msg.sender,todos[_index]);
    }
}
// interface IWhitelist {
//     function maxWhitelistedAddresses() external view returns (uint8);
//     function whitelistedAddresses(address) external view returns (bool);
//     function numAddressesWhitelisted() external view returns (uint8);
//     function addAddressToWhitelist() external;
// }