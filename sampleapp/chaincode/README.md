# Chaincode directory

`ledger-api` - consists of files that build up to facilitate a data structure we follow.  
`lib` - consists of our smart contract and a folder that is user-defined which holds files that make use of the ledger-api.  
`index.js` - kind of an entrypoint file which tells the fabric contract API where to look for user's smart contract.  
`package.json` - the main file which lists the dependencies and node version etc. You can copy this file from here.  
`tryout_cli.md` - A small guide that briefs about how to start the network and then deploy chaincode. Also, tells shows how to upgrade your chaincode to a newer version.

To refer more on fundamentals of chaincode, take a look at this:
- [Start Developing Hyperledger Fabric Chaincode in Node.js](https://medium.com/coinmonks/start-developing-hyperledger-fabric-chaincode-in-node-js-e63b655d98db)
- [Details on the programming model](https://hyperledger.github.io/fabric-chaincode-node/master/api/tutorial-deep-dive-contract-interface.html)
