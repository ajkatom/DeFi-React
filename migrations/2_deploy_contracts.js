

const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(deployer,network,accounts) {

  // Deploy Dai Token 
  await deployer.deploy(DaiToken);
  const daiToken = await  DaiToken.deployed();
  
  // Deploy Dapp Token 
  await deployer.deploy(DappToken);
  const dappToken = await  DappToken.deployed();

 // Deploy Token Farm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

   // Tranfer all Dapp Tokens to Token Farm
  await dappToken.transfer(TokenFarm.address,'1000000000000000000000000');

   // Tranfer 100 Mock DAI Tokens to investor
   await  daiToken.transfer(accounts[1],'100000000000000000000')



};