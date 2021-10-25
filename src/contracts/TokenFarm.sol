pragma solidity ^0.5.0;

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm {

  string public name = 'DApp Token Farm';
  DappToken public dappToken;
  DaiToken public daiToken;
  address public owner;
  
  address[] public stakers;
  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;


  constructor(DappToken _dappToken, DaiToken _daiToken) public {
    dappToken  = _dappToken;
    daiToken = _daiToken;
    owner = msg.sender;
  }

  // Staking Tokens (Depossiting)
  function stakeTokens (uint _amount) public {
    //validate staking amount is greater then 0
    require(_amount > 0,'amount must be greater then 0');

    //transfering Mock Dai tokens from investor(depositor)to contract(in TokenFarm)
    daiToken.transferFrom(msg.sender, address(this), _amount);
    
    // Update token balance for staking
    stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

    //add invester to invstores array ONLY if he is NEW. 
    if(!hasStaked[msg.sender]){
      stakers.push(msg.sender);
    }
    //update user investor status to true
    hasStaked[msg.sender] = true;
    isStaking[msg.sender] = true;
  }

  // Issuing Tokens (interest on deopsit)
  function issueToken() public {
    //Only owner is allowed to issue tokens
    require(msg.sender == owner,'caller must be owner');

    //Issuing tokens to investors
    for (uint i=0; i<stakers.length; i++){
      address recipient = stakers[i];
      uint balance = stakingBalance[recipient];
      if(balance > 0 ){
      dappToken.transfer(recipient, balance);
      }
    }
  }

  // Unstaking Tokens (withdrawal)
  function unstakeTokens () public {
    uint balance = stakingBalance[msg.sender];
    require(balance > 0, 'account balance is 0 cannot withdraw tokens');

    //withdraw tokens and send to back to investors account
    daiToken.transfer(msg.sender, balance);

    //resert staking balance
    stakingBalance[msg.sender] = 0;

    //uodate staking status
    isStaking[msg.sender] = false;
  }

}