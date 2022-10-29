//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;


contract Transfer {
    address reader;
    
    function setReader() public {
        reader = msg.sender;
    }
    function payWriter(address payable writer) external payable {
        writer.transfer(msg.value);
    }
}
