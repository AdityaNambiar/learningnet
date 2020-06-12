# Hyperledger Fabric configuration documentation:
YT Series to watch for understanding configuration files in depth (of Fabric 2.0):
https://www.youtube.com/playlist?list=PLSBNVhWU6KjW4qo1RlmR7cvvV8XIILub6
## crypto-config
- A folder which keeps all crypto material of different entities. 
	-- Orderers and Peers are the two main entities whose crypto material is stored under this folder.
	-- Organizations providing (hosting) orderers in the network will have their crypto material (all ) 
  

### Steps (follow this sequence strictly):

NOTE: If you receive any DeltaSet error and find 'unknown authority error' in orderer logs, 
perform a clean up using the long command given in [Cleanup](#cleanup)

1. Crypto step: After modifications to `crypto-config.yaml` file (if required), run `./myscripts/create-crypto.sh`
2. Genesis step: After modifications to `configtx.yaml` file (if required), run `./myscripts/create-genesis.sh`
3. NetworkUp step: Run `docker-compose down; docker volume prune -f; docker-compose up -d`
4. ChannelCreate step: To start the channel, Run `./myscripts/createChannel.sh`


--- 
#### Cleanup {#cleanup}
While cleanup, make sure to remove `crypto` and `fabric` folders from the network's directory:  
`sudo rm -r ../{crypto,fabric};`  
The curly braces is the _bash_ syntax to combine: `../crypto` & `../fabric` 
  
Full/Long clean up command:
`sudo rm -r ../{crypto,fabric,crypto-config,channel-artifacts/genesis.block,channel-artifacts/ofss-mum.tx`

- Make sure to replace "ofss-mum" with $CHANNEL_NAME value.

