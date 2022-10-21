//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Book {
    uint256 public id; 
    address payable public writer;
    
    constructor() {
        writer = payable(msg.sender);
    }

    function pay(uint256 numChars) external payable {
        require(
            msg.value == numChars / 1000,
            "Please pay the correct amount!"
        );

        writer.transfer(msg.value);
    }
    
}