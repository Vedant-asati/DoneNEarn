    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.10;

    contract Authenticator {
        address immutable public OWNER;
        constructor() {
            OWNER=msg.sender;
        }
        mapping(address => bytes32) private LoginData;
        mapping(address => uint256) public noOfTasksDone;
        bool public locked; // false
        bool public eligible; // false
        modifier noReentrancy() {
            require(!locked, "No reentrancy");
            locked = true;
            _;
            locked = false;
        }
        modifier onlyOWNER() {
            require(msg.sender==OWNER, "JSR!! ONLY OWNER can access!!");
            _;
        }
        modifier onlyWorker() {
            require(LoginData[msg.sender]!=0x0 , "JSR! You are not our employee!!");
            require(msg.sender!=OWNER, "JSR! You are the boss!!");
            _;
        }
        
        function getLoginData() public view onlyWorker  returns (bytes32) {
            return LoginData[msg.sender];
        }
        function SignUp(string calldata _pwd) public noReentrancy {
            require(msg.sender!=OWNER, "JSR! You are the boss!!");
            // payable
            // require(msg.value>=1000000000,"jai siyaram ... it is not joke!!")
            require(LoginData[msg.sender]==0x0, "JSR! No changes entertained!!");
            require(bytes(_pwd).length > 0, "JSR! Password cannot be empty!!");
            bytes32 hashedPwd = keccak256(abi.encodePacked(msg.sender,_pwd));
            LoginData[msg.sender] = hashedPwd;
        }
        function remove() public {
            require(LoginData[msg.sender]!=0x0,"jsr only employees can delete login info");
            // payable
            // require(msg.value>=1000000000,"jai siyaram ... it is not joke!!")
            delete LoginData[msg.sender];
        }

        // function doTask() public noReentrancy onlyWorker {
        //     require(LoginData[msg.sender]!=0x0,"jsr only employees can do task");
        //     // payable
        //     // require(msg.value>=1000000000,"jai siyaram ... it is not joke!!")
        //     noOfTasksDone[msg.sender]+=1;
        // }

        // function availNFTs() public onlyWorker noReentrancy returns (uint) {
        //     require(LoginData[msg.sender]!=0x0,"jsr only employees can avail");
        //     if(noOfTasksDone[msg.sender]>=3){
        //         // eligible=true;
        //         uint noOfNFTs = noOfTasksDone[msg.sender]/3;
        //         noOfTasksDone[msg.sender]%=3;
        //         return noOfNFTs;
        //     }
        //     return 0;
        //     // also implement nft logic
        // }


    }