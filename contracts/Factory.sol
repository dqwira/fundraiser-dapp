// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

import "./Fundraiser.sol";

contract Factory {
    // most items that can be returned from fundraisers function
    uint256 constant maxLimit = 20;

    Fundraiser[] private _fundraisers;

    event FundraiserCreated(
        Fundraiser indexed fundraiser,
        address indexed owner
    );

    function fundraisersCount() public view returns (uint256) {
        return _fundraisers.length;
    }

    function createFundraiser(
        string memory name,
        string memory description,
        string memory url,
        string memory imageURL,
        address payable beneficiary
    ) public {
        Fundraiser fundraiser = new Fundraiser(
            name,
            description,
            url,
            imageURL,
            beneficiary,
            msg.sender
        );
        _fundraisers.push(fundraiser);
        emit FundraiserCreated(fundraiser, msg.sender);
    }

    function fundraisers(uint256 limit, uint256 offset)
        public
        view
        returns (Fundraiser[] memory coll)
    {
        require(offset <= fundraisersCount(), "offset out of bounds");
        // start our size as difference between total count and offset
        uint256 size = fundraisersCount() - offset;
        // size should be the smaller of the count or the limit
        size = size < limit ? size : limit;
        // size should not exceed the maxLimit
        size = size < maxLimit ? size : maxLimit;
        // build our collection to return based off of limit and offest
        coll = new Fundraiser[](size);
        for (uint256 i = 0; i < size; i++) {
            coll[i] = _fundraisers[offset + i];
        }
        return coll;
    }
}
