import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Navbar from './Navbar';
import './App.css';
import DaiToken from '../abis/DaiToken.json';
import DappToken from '../abis/DappToken.json';
import TokenFarm from '../abis/TokenFarm.json';

 const App = (props) => {
  const [state, setState] = useState(
    { 
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      diaTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  );
  
  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected please install the correct extension')
    }
  }

  async function loadBlockchainData(){
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setState(state => ({...state, account: accounts[0]}));
    const netWorkId = await web3.eth.net.getId();
    const daiTokenData = DaiToken.networks[netWorkId];
    const dappTokenData = DappToken.networks[netWorkId];
    const tokenFarmData = DappToken.networks[netWorkId];

    // Load DiaToken
    if(daiTokenData){
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
      setState(state => ({...state, daiToken: daiToken}));
      let daiTokenBalance = await daiToken.methods.balanceOf(accounts[0]).call();
      setState(state => ({...state, diaTokenBalance : daiTokenBalance.toString()}));
    }
     else{
       window.alert('DappToken contract was not depolyed to detected network');
      }

      // Load DappToken
      if(dappTokenData){
        const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address);
        setState(state => ({...state, dappToken: dappToken}));
        let dappTokenBalance = await dappToken.methods.balanceOf(accounts[0]).call();
        setState(state => ({...state, dappTokenBalance : dappTokenBalance.toString()}));
      }
      else{
        window.alert('DappToken contract was not depolyed to detected network');
      }

      // Load TokenFarm
      
      if(tokenFarmData){
        const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
        setState(state => ({...state, tokenFarm: tokenFarm}));
        let stakingBalance = await tokenFarm.methods.stakingBalance(accounts[0]).call();
        setState(state => ({...state, stakingBalance : stakingBalance.toString()}));
      }
      else{
        window.alert('TokenFarm contract was not depolyed to detected network');
      }
   }
  



  useEffect(()=>{
   loadWeb3();
   loadBlockchainData(); 
  },[]);
  
  // useEffect(()=>{
  //   loadBlockchainData()
  // },[state.account]);
  
  return (
    <div>
        {console.log(state)}
          <Navbar account={state.account} />
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
                <div className="content mr-auto ml-auto">
                  <a
                    href="http://www.dappuniversity.com/bootcamp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  </a>

                  <h1>Hello, World!</h1>

                </div>
              </main>
            </div>
          </div>
        </div>
      );
  }

export default App;
