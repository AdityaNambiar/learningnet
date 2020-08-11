**Note**: Before executing the below scripts, be sure to stay on the `learningnet/` folder (because that is where the scripts reside. This particular file had to be kept here for organizing purposes.  
- Run `./deployChaincode.sh` **after** `./startLNet.sh`... you need your network so that chaincode script can send requests to peers.

- If you make any changes in the chaincode `lib/sampleappcontract.js`, make changes in mentioned files (read the point given below) and then run `./upgradeChaincode.sh`.
    - The difference in deployChaincode and upgradeChaincode is, you change the version (in this script as well as in `package.json`) and sequence numbers (in this script) 

`chaincodeInvokeInit` ~ For invoking the init function (useful to initialize ledger)
`chaincodeInvoke` ~ Basically same as `chaincodeInvokeInit` but just without `--IsInit` (So this call to peers won't be registered as initialization of chaincode ~ just to remind you, remember any chaincode transaction invocation requires initilization first and is done only once)

#### Documentation links:
1. [Fabric chaincode lifecycle — hyperledger-fabricdocs master documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.0/chaincode_lifecycle.html#step-three-approve-a-chaincode-definition-for-your-organization)
2. [peer chaincode — hyperledger-fabricdocs master documentation](https://hyperledger-fabric.readthedocs.io/en/latest/commands/peerchaincode.html#flags)
