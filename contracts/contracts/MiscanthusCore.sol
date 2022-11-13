//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract MiscanthusCore is ERC721 {
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    Counters.Counter private _tokenIds;

    IERC20 immutable STABLECOIN;
    uint256 public immutable FIRST_EPOCH_START;

    uint256 public MIN_CONTRACT_VALUE = 0.01 ether;
    uint256 public MIN_CONTRACT_DURATION = 1 hours;
    uint256 public MAX_CONTRACT_DURATION = 1 weeks;

    struct FuturesDetails {
        uint256 contractId;
        uint256 quantity;
        uint256 contractPrice;
        uint256 settlementEpoch;
        address writer;
    }

    mapping(uint256 => FuturesDetails) public futuresDetailsById;
    mapping(address => uint256) public userBalanceUSD;
    mapping(address => uint256) public userBalance;

    mapping(address => EnumerableSet.UintSet) private userNFTs;
    mapping(uint256 => EnumerableSet.UintSet) private contractsByEpoch;

    constructor(address stablecoin) ERC721("Miscanthus", "MSCTS") {
        STABLECOIN = IERC20(stablecoin);
        FIRST_EPOCH_START = block.timestamp - (block.timestamp % 1 days);
    }

    event SettleContract(uint256 contractId, uint256 settlementEpoch);
    event BuyContract(
        uint256 contractId,
        uint256 indexed epoch,
        address indexed buyer,
        address indexed writer
    );
    event WriteContract(
        uint256 contractId,
        uint256 indexed epoch,
        uint256 quantity,
        uint256 contractPrice,
        uint256 settlementEpoch,
        address indexed writer
    );
    event CancelPosition(
        uint256 contractId,
        uint256 indexed epoch,
        address indexed writer
    );

    function writeContract(
        uint256 quantity,
        uint256 contractDurationInEpoch,
        uint256 contractPrice
    ) public {
        require(userBalance[msg.sender] >= quantity, "not enough balance");
        require(contractDurationInEpoch > 0, "too low contract duration");
        require(contractPrice >= MIN_CONTRACT_VALUE, "contract value to low");

        userBalance[msg.sender] -= quantity;

        // save contract details
        FuturesDetails memory newFutures = FuturesDetails({
            contractId: _tokenIds.current(),
            quantity: quantity,
            contractPrice: contractPrice,
            settlementEpoch: getCurrentEpoch() + contractDurationInEpoch,
            writer: msg.sender
        });
        futuresDetailsById[_tokenIds.current()] = newFutures;

        // update sets
        contractsByEpoch[getCurrentEpoch()].add(_tokenIds.current());
        userNFTs[msg.sender].add(_tokenIds.current());

        // mint NFT
        _mint(address(this), _tokenIds.current());

        emit WriteContract(
            _tokenIds.current(),
            getCurrentEpoch(),
            quantity,
            contractPrice,
            getCurrentEpoch() + contractDurationInEpoch,
            msg.sender
        );
        _tokenIds.increment();
    }

    function buyContract(uint256 contractId) public payable {
        require(
            userBalanceUSD[msg.sender] >=
                futuresDetailsById[contractId].contractPrice,
            "insufficient USD balance"
        );
        require(
            ownerOf(contractId) == address(this),
            "cannot buy from zero address"
        );
        address writer = futuresDetailsById[contractId].writer;

        userBalanceUSD[msg.sender] -= futuresDetailsById[contractId]
            .contractPrice;

        // update sets
        userNFTs[msg.sender].add(contractId);
        contractsByEpoch[getCurrentEpoch()].remove(contractId);

        _safeTransfer(address(this), msg.sender, contractId, "");

        emit BuyContract(contractId, getCurrentEpoch(), msg.sender, writer);
    }

    function settleContract(uint256 contractId) public {
        require(
            futuresDetailsById[contractId].settlementEpoch >= getCurrentEpoch(),
            "contract not expired"
        );

        address owner = ownerOf(contractId);

        require(owner != address(this), "contract was not sold");

        address writer = futuresDetailsById[contractId].writer;
        uint256 contractPrice = futuresDetailsById[contractId].contractPrice;

        // writer should recieve USD
        payable(owner).transfer(contractPrice);

        // buyer should recieve NATIVE
        STABLECOIN.transfer(writer, contractPrice);

        // update sets
        userNFTs[owner].remove(contractId);
        userNFTs[writer].remove(contractId);

        _burn(contractId);

        emit SettleContract(
            contractId,
            futuresDetailsById[contractId].settlementEpoch
        );
    }

    function cancelPosition(uint256 contractId) external {
        require(
            futuresDetailsById[contractId].writer == msg.sender,
            "not creator"
        );
        require(ownerOf(contractId) == address(this), "contract already sold");

        userBalance[msg.sender] += futuresDetailsById[contractId].quantity;

        // update sets
        userNFTs[msg.sender].remove(contractId);
        contractsByEpoch[getCurrentEpoch()].remove(contractId);

        delete futuresDetailsById[contractId];
        _burn(contractId);

        emit CancelPosition(contractId, getCurrentEpoch(), msg.sender);
    }

    function depositUSD() external {
        require(
            STABLECOIN.allowance(msg.sender, address(this)) > 0,
            "no deposit"
        );

        uint256 value = STABLECOIN.allowance(msg.sender, address(this));
        STABLECOIN.transferFrom(msg.sender, address(this), value);

        userBalanceUSD[msg.sender] += value;
    }

    function withdrawUSD(uint256 amount) public {
        require(
            userBalanceUSD[msg.sender] >= amount,
            "insufficient USD balance"
        );

        userBalanceUSD[msg.sender] -= amount;
        STABLECOIN.transferFrom(address(this), msg.sender, amount);
    }

    function deposit() external payable {
        require(msg.value > 0, "cannot deposit 0 value");

        userBalance[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(userBalance[msg.sender] >= amount, "insufficent balance");

        userBalance[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function getCurrentEpoch() public view returns (uint256) {
        return (block.timestamp - FIRST_EPOCH_START) / 1 days;
    }

    function getAllContracts(uint256 epoch)
        public
        view
        returns (FuturesDetails[] memory)
    {
        uint256 length = contractsByEpoch[epoch].length();
        FuturesDetails[] memory allContracts = new FuturesDetails[](length);

        for (uint256 i = 0; i < length; i++) {
            allContracts[i] = futuresDetailsById[contractsByEpoch[epoch].at(i)]; // get details of I contract in specified epoch
        }

        return allContracts;
    }

    function getUserPositions() public view returns (FuturesDetails[] memory) {
        uint256 length = userNFTs[msg.sender].length();
        FuturesDetails[] memory allContracts = new FuturesDetails[](length);

        for (uint256 i = 0; i < length; i++) {
            allContracts[i] = futuresDetailsById[userNFTs[msg.sender].at(i)];
        }

        return allContracts;
    }
}
