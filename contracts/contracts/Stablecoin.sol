// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Stablecoin is ERC20 {
    constructor(uint256 initialSupply) ERC20("Stablecoin", "USDM") {
        _mint(msg.sender, initialSupply * 1 ether);
    }

    function getTokens() public payable {
        require(msg.value > 0.001 ether);

        // 1000 USDM for 1     TRX
        // 1    USDM for 0.001 TRX
        _mint(msg.sender, msg.value * 1000);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
