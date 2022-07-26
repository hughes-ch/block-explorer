// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract TestErc20 is ERC20Burnable {
    constructor() ERC20("TestErc20", "TEST") {
        _mint(msg.sender, 1000);
    }
}
