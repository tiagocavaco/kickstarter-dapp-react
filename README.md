# kickstarter-dapp-react

Kickstarter dapp in react and solidity, learning example. [kickstarter-dapp-react](https://tiagocavaco.github.io/kickstarter-dapp-react/)

## Getting started

### Install Node
- https://nodejs.org/en/download/

### Install VSCode
- https://code.visualstudio.com/download

### Install Solidity extension on VSCode
- https://marketplace.visualstudio.com/items?itemName=juanblanco.solidity

### Install Ganache:
- https://trufflesuite.com/ganache/

```
Search for Developer Settings on Windows and set Developer Mode on, then run on powershell:
Add-AppxPackage -Path "C:\Users\Administrator\Downloads\Ganache-2.5.4-win-x64.appx"
```

## Installation

Open terminal on root of the project and run:

- `npm install`

## Available Scripts

In the project directory, you can run:

### `npm test`

Launches the test runner.

### `npm run build`

Compiles smart contracts and saves them as json files inside .build folder.

### `npm run deploy`

Deploys smart contracta to local ganache or to testnet with HDWalletProvider, creates a json file inside .deploy folder with contract address and abi of each contract.