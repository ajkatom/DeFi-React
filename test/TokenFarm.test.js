const { assert } = require('chai');

const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

require('chai')
  .use(require('chai-as-promised'))
  .should();

function tokens(x) {
  return web3.utils.toWei(x, 'ether');
}

contract('TokenFarm',([owner, investor]) => {
  let daiToken, dappToken, tokenFarm ;

  before(async ()=>{
    //Loading Contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    //tranfer all Dapp tokens to farm (1 mil)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'));
    await daiToken.transfer(investor, tokens('100'), {from : owner });

  })
  describe('Mock DAI deployment', async () => {
    it('has a name',  async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token');
    });
  });
  describe('DApp Token deployment', async () => {
    it('has a name',  async () => {
      const name = await dappToken.name()
      assert.equal(name, 'DApp Token');
    });
  });
  describe('Token Farm deployment', async () => {
    it('has a name',  async () => {
      const name = await tokenFarm.name()
      assert.equal(name, 'DApp Token Farm');
    });
    it('contract has tokens', async () =>{
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens('1000000'));
    });

  });
  describe('token farming', async () =>{
    it('rewards investors for staking mDai tokens', async () => {
      let result

      //investor balance check prior to staking
      result = await  daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet doesn\'t have corret balance before staking');
      
      // Stake Moc DAI Tokens
      await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
      await tokenFarm.stakeTokens(tokens('100'), { from: investor });
      
      // Checking staking result
      
      // Investor balance check after to staking
      result = await  daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet doesn\'t have corret balance after staking');
  
      result = await  daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI wallet dosn\'t have corret balance after staking');
   
      result = await  tokenFarm.stakingBalance(investor);
      assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI wallet dosn\'t have corret balance after staking');
      
      result = await  tokenFarm.isStaking(investor);
      assert.equal(result.toString(), 'true', 'investor status is correct after staking');

      await tokenFarm.issueToken({from : owner});
      result = await dappToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('100'), 'The balance is not correct after tokens issued');

      await tokenFarm.issueToken({from: investor}).should.be.rejected;

      // check results after unstaking
      await tokenFarm.unstakeTokens({ from: investor });
      
      
      //check that tokens were returned to investor
      result = await  daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('100'), 'Investor Mock DAI wallet hasn\'t been returned after unstaking');
      
      //check that balance of TokenFarm investor account is empty
      result = await  daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), tokens('0'), 'Investor Mock DAI wallet isn\'t empty after unstaking');
      
      result = await  tokenFarm.stakingBalance(investor);
      assert.equal(result.toString(), tokens('0'), 'Investor Mock DAI tokenFarm isn\'t empty after unstaking');

    });
   
  });

});