# DApp Fundraisers

Use the [fundraisers demo app](https://fundraisers.dco.dev/) with a Web3 wallet, like [MetaMask](https://metamask.io/), connected to any one of the supported networks. The application can run on a local blockchain (Parity, Geth, Ganache), or one of the following Ethereum testnets: Ropsten, Kovan, Rinkeby, and Goerli.  Create fundraisers, donate to them, and withdraw your donations, all with Ether, all on the blockchain, from anywhere.

This repository holds the smart contract and front end code for a fundraisers application run on the Ethereum blockchain.  The app shows a number of fundraisers that users can donate to for the particular cause. You can create fundraisers for other users to donate to, and you may act as a custodian to withdraw all the fundraiser donations and transfer them to the beneficiary who created it.

The `Factory` smart contract handles creating new fundraisers and paginating between them.  It calls logic held in the Fundraiser smart contract for each particular fundraiser. This contract uses the factory pattern to create, store, and work with a collection of Fundraiser smart contracts.

Each `Fundraiser` smart contract will hold all the funds of the donations, and a custodian may act on the behalf of a beneficiary to withdraw the funds and deposit them directly into the beneficiary's wallet address. The custodian may also set the beneficiary account.  The custodian defaults to the deployer of the contract.

## Smart Contract Dependencies

The smart contracts are written in Solidity, and they use some dependencies, including [OpenZeppelin](https://openzeppelin.com/) as a source for smart contract inheritance. Therefore, these dependencies need to be installed prior to working with the project.

Ensure you are located at the root of the project, and install them with NPM:

```bash
npm i
```

## Deploy the contracts

Deploy the contracts to the client application and connect to a local network. Use a tool like [Ganache](https;//trufflesuite.com/ganache) to spin up a local blockchain, then deploy the fundraiser contracts by deploying to the development network configured in `truffle.config.js`.  You may update this to be your own local host of your choice.

Ensure your local blockchain network is running and that `truffle.config.js` is up to date with the config, then run the following:

```bash
truffle compile
truffle migrate --network develop
```

## Client App & Dependencies

The front end is a React application that holds the contracts built from the root directory. The client app is located in `./client`. Install the dependencies with:

```bash
cd client
yarn install
```

### Build the client app

Ensure you have a browser wallet installed and accounts connected to your local blockchain that you've spun up, and then start up the client application to interact with the fundraisers.  The app should spin up on `localhost:3000`.

```bash
cd client # if not in client dir already
yarn start
```

Now you should have a local instance of this fundraiser app, connected to your own local blockchain with your own test wallets, and you can create new fundraisers and interact with them by making donations to the causes, all stored on the blockchain.

<p align="center">
 <img src="https://visitor-badge.glitch.me/badge?page_id=drewcook.dapp-fundraisers" alt="visitor count"/>
</p>
