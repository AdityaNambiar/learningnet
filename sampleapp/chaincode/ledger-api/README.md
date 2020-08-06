# Ledger API

- Ledger API is a data structure that consists of two files that are responsible to store your network assets in an organized list format.
- It was taken from the [Commercial Paper](https://github.com/hyperledger/fabric-samples/tree/release-1.4/commercial-paper/organization/magnetocorp/contract/ledger-api) tutorial.

## The fundamental idea
- To store assets, which could be any object (which has some properties and methods) say a car or a person, on the the Fabric network.

## What is a state?
- A state or in other words, an asset is simply an object that contains some properties. 

## What is a statelist?
- This file has some methods which we can use to build our custom statelist or registries (in the terminology of Hyperledger Composer) for assets.
 
### Why are `state.js` and `statelist.js` written?
- These files have some methods which we can use to build our custom states or assets under the `lib/` folder.  
- These help in modularizing our code and having a seperate API which facilitates the creation of our assets.

##### Some facts:
- Ledger API has been proposed to be added in the official SDK, https://github.com/hyperledger/fabric-rfcs/pull/16
