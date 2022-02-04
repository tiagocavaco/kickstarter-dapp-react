const assert = require('assert');
// mod.cjs
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const ganache = require('ganache-cli');
const Web3 = require('web3');
const linker = require('solc/linker');

require('dotenv').config();

const CampaignDeployer = require('../.build/CampaignDeployer.json');
const CampaignFactory = require('../.build/CampaignFactory.json');
const Campaign = require('../.build/Campaign.json');

let web3;
let accounts;
let campaignDeployer;
let campaignFactory;
let campaignAddress;
let campaign;

const initializeWeb3 = async () => {
  let provider = ganache.provider({ mnemonic: process.env.TEST_MNEMONIC_PHRASE });

  try {
    const ganacheLocalhost = 'http://localhost:8545';

    provider = await fetch(ganacheLocalhost) && ganacheLocalhost;

    console.log('Using Ganache as web3 provider.');
  } catch {
    console.log('Using ganache-cli as web3 provider.');
  }

  return new Web3(provider);
}

before(async () => {
  // Initialize web3 provider
  web3 = await initializeWeb3();

  // Get a list of all account
  accounts = await web3.eth.getAccounts();
});

beforeEach(async () => {
  // Deploy campaign deployer library
  campaignDeployer = await new web3.eth.Contract(CampaignDeployer.abi)
    .deploy({ data: CampaignDeployer.evm.bytecode.object })
    .send({ 
      from: accounts[0], 
      gas: '1500000' 
    });

  // Link campaign factory bytecode with campaign deployer library address
  const campaignFactoryLinkedBytecode = linker.linkBytecode(CampaignFactory.evm.bytecode.object, {
    "CampaignDeployer.sol": {
      "CampaignDeployer": campaignDeployer.options.address
    }
  });

  // Deploy campaign factory contract
  campaignFactory = await new web3.eth.Contract(CampaignFactory.abi)
    .deploy({ data: campaignFactoryLinkedBytecode })
    .send({ 
      from: accounts[0], 
      gas: '1500000' 
    });

  // Create campaing
  await campaignFactory.methods.createCampaign('100')
    .send({ 
      from: accounts[0], 
      gas: '1500000' 
    });

  // Get deployed campaign contract address
  [campaignAddress] = await campaignFactory.methods.getDeployedCampaigns().call();

  // Load deployed campaign contract
  campaign = await new web3.eth.Contract(Campaign.abi, campaignAddress);
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(campaignFactory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();

    assert.equal(manager, accounts[0]);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute()
      .send({
        value: '200',
        from: accounts[1],
        gas: '1000000'
      });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute()
        .send({
          value: '50',
          from: accounts[2],
          gas: '1000000'
        });

      assert.fail('contribute should not have succeeded.');
    }
    catch (err) {
      assert.match(err.message, /Value should be greater than minimum contribution/);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods.createRequest('Buy batteries', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    const request = await campaign.methods.requests(0).call();

    assert.equal(request.description, 'Buy batteries');
  });

  it('requires a manager to create a payment request', async () => {
    try {
      await campaign.methods.createRequest('Buy batteries', '100', accounts[1])
      .send({
        from: accounts[1],
        gas: '1000000'
      });

      assert.fail('createRequest should not have succeeded.');
    }
    catch (err) {
      assert.match(err.message, /Only manager can execute this function/);
    }
  });

  it('requires sender to be an approver to approve request', async () => {
    await campaign.methods.createRequest('Buy batteries', '100', accounts[1])
    .send({
      from: accounts[0],
      gas: '1000000'
    });

    try {
      await campaign.methods.approveRequest(0)
      .send({
        from: accounts[0],
        gas: '1000000'
      });

      assert.fail('approveRequest should not have succeeded.');
    }
    catch (err) {
      assert.match(err.message, /Sender is not an approver/);
    }
  });

  it('requires sender to not have approved the same request before approve request', async () => {
    await campaign.methods.contribute()
    .send({
      from: accounts[0],
      value: '200',
      gas: '1000000'
    });

    await campaign.methods.createRequest('Buy batteries', '100', accounts[1])
    .send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.approveRequest(0)
    .send({
      from: accounts[0],
      gas: '1000000'
    });

    try {
      await campaign.methods.approveRequest(0)
      .send({
        from: accounts[0],
        gas: '1000000'
      });

      assert.fail('approveRequest should not have succeeded.');
    }
    catch (err) {
      assert.match(err.message, /Sender already voted on this request/);
    }
  });

  it('requires a manager to finalize request', async () => {
    await campaign.methods.createRequest('Buy batteries', '100', accounts[1])
    .send({
      from: accounts[0],
      gas: '1000000'
    });

    try {
      await campaign.methods.finalizeRequest(0)
      .send({
        from: accounts[1],
        gas: '1000000'
      }); 

      assert.fail('finalizeRequest should not have succeeded.');
    }
    catch (err) {
      assert.match(err.message, /Only manager can execute this function/);
    }
  });

  it('requires request to not have been already completed before finalize request', async () => {
    await campaign.methods.contribute()
    .send({
      from: accounts[0],
      value: '200',
      gas: '1000000'
    });

    await campaign.methods.createRequest('Buy batteries', '100', accounts[1])
    .send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.approveRequest(0)
    .send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.finalizeRequest(0)
    .send({
      from: accounts[0],
      gas: '1000000'
    }); 

    try {
      await campaign.methods.finalizeRequest(0)
      .send({
        from: accounts[0],
        gas: '1000000'
      }); 

      assert.fail('finalizeRequest should not have succeeded.');
    }
    catch (err) {
      assert.match(err.message, /Request is already completed/);
    }
  });

  it('requires request approval count to be greater than 50% to finalize request', async () => {
    await campaign.methods.contribute()
    .send({
      from: accounts[0],
      value: '200',
      gas: '1000000'
    });

    await campaign.methods.contribute()
    .send({
      from: accounts[1],
      value: '200',
      gas: '1000000'
    });

    await campaign.methods.createRequest('Buy batteries', '100', accounts[1])
    .send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.approveRequest(0)
    .send({
      from: accounts[0],
      gas: '1000000'
    });

    try {
      await campaign.methods.finalizeRequest(0)
      .send({
        from: accounts[0],
        gas: '1000000'
      }); 

      assert.fail('finalizeRequest should not have succeeded.');
    }
    catch (err) {
      assert.match(err.message, /Not enough contributors have approved this request/);
    }
  });

  it('processes requests', async () => {
    await campaign.methods.contribute()
      .send({
        from: accounts[0],
        value: web3.utils.toWei('1', 'ether')
      });

    await campaign.methods.createRequest('Another request', web3.utils.toWei('1', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    await campaign.methods.approveRequest(0)
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    const receiverInitialBalance = await web3.eth.getBalance(accounts[1]);

    await campaign.methods.finalizeRequest(0)
      .send({
        from: accounts[0],
        gas: '1000000'
      }); 

    const receiverFinalBalance = await web3.eth.getBalance(accounts[1]);

    let receiverBalanceDif = receiverFinalBalance - receiverInitialBalance;
    receiverBalanceDif = web3.utils.fromWei(receiverBalanceDif.toString(), 'ether');
    receiverBalanceDif = parseFloat(receiverBalanceDif);

    assert(receiverBalanceDif === 1);
  });
});