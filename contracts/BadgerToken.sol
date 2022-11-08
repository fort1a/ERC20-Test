//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract BadgerToken is ERC20Capped {
    address payable public owner;

    constructor(uint256 tokencap)
        ERC20("BadgerToken", "BDG")
        ERC20Capped(tokencap * (10**decimals()))
    {
        owner = payable(msg.sender);
        _mint(owner, 50000 * (10**decimals()));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner.");
        _;
    }

    function wipe() public onlyOwner {
        selfdestruct(owner);
    }
}
