require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const linker = require('solc/linker');
const fs = require('fs-extra');
const path = require('path');

// mod.cjs
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const CampaignDeployer = require('../ethereum/.build/CampaignDeployer.json');
const CampaignFactory = require('../ethereum/.build/CampaignFactory.json');

const deployPath = path.resolve(__dirname, '.deploy');

const ganacheLocalhost = 'http://localhost:8545';

let provider = new HDWalletProvider(
  process.env.DEV_MNEMONIC_PHRASE,
  process.env.INFURA_PROVIDER_URL
);

const initializeWeb3 = async () => {
  try {
    provider = await fetch(ganacheLocalhost) && ganacheLocalhost;

    console.log('Using Ganache as web3 provider.');
  } catch {
    console.log('Using HDWalletProvider as web3 provider.');
  }

  return new Web3(provider);
}

const deployLibrary = async (web3, accounts, libName, compiledLib, reuse) => {
  let libContractAddress;

  const libPath = path.resolve(deployPath, `${libName}.json`);

  if (reuse && fs.existsSync(libPath)) {
    const libDeployed = fs.readJsonSync(libPath);

    libContractAddress = libDeployed.address;

    console.log(`${libName} Library was already deployed to`, libContractAddress);
  } else {
    const lib = await new web3.eth.Contract(compiledLib.abi)
      .deploy({ data: compiledLib.evm.bytecode.object })
      .send({
        from: accounts[0],
        gas: '1500000'
      });

    libContractAddress = lib.options.address;

    console.log(`${libName} Library deployed to`, libContractAddress);

    createDeployContractJsonFile(libName, libContractAddress, compiledLib.abi);
  }

  return {
    [`${libName}.sol`]: {
      [libName]: libContractAddress
    }
  };
}

const deployContract = async (web3, accounts, contractName, compiledContract, libs) => {
  let contractBytecode = compiledContract.evm.bytecode.object;

  if (libs) {
    // Link contract with libs
    contractBytecode = linker.linkBytecode(contractBytecode, libs);
  }

  const contract = await new web3.eth.Contract(compiledContract.abi)
    .deploy({ data: contractBytecode })
    .send({
      from: accounts[0],
      gas: '1500000'
    });

  console.log(`${contractName} Contract deployed to`, contract.options.address);

  createDeployContractJsonFile(contractName, contract.options.address, compiledContract.abi);
}

const createDeployContractJsonFile = (contractName, contractAddress, contractAbi) => {
  const contactInfo = {
    address: contractAddress,
    abi: contractAbi
  }

  fs.ensureDirSync(deployPath);

  const jsonFilePath = path.resolve(deployPath, `${contractName}.json`);

  fs.outputJSONSync(jsonFilePath, contactInfo, { spaces: 2 }, (err) => {
    console.log(`Error trying to write file: ${contractName}.json`, err);
  });
}

const deploy = async () => {
  const web3 = await initializeWeb3();

  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  try{
    const campaignDeployerlib = await deployLibrary(web3, accounts, 'CampaignDeployer', CampaignDeployer, true);

    await deployContract(web3, accounts, 'CampaignFactory', CampaignFactory, campaignDeployerlib)
  }
  catch (err) {
    fs.removeSync(deployPath); // Clear deploy folder

    throw err;
  }


  if (provider !== ganacheLocalhost) {
    provider.engine.stop();
  }

  console.log('Deploy finished with success');

  process.exit();
}

deploy();