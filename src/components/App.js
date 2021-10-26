import React, { Component, useState, useEffect } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import './App.css'

 const App = (props) => {
  const [state, setState] = useState(
    { 
      account: '0x0',
      diaToken: {},
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
    console.log(accounts);
    setState(prevState => ({...prevState, account: accounts[0]}));
  }

  useEffect(()=>{
   loadWeb3();
   loadBlockchainData(); 
  },[]);
  
  return (
    <div>
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
