//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Post {
    address public operator;
    string[] public pages; //getter: pages(i)

    constructor() {
        operator = msg.sender;
    }

    function getNumPages() public view returns (uint256) {
        return pages.length;
    }

    function addPage(string memory content) public onlyOperator() returns (bool success) {
        pages.push(content);
        return true;
    }

    // modifiers

    /// Only the operator can call this function
    error OnlyOperator();

    modifier onlyOperator() {
        if(msg.sender != operator) {
            revert OnlyOperator();
        }
        _;
    }

}
