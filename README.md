# Hyperledger Fabric configuration documentation:
YT Series to watch for understanding configuration files in depth (of Fabric 2.0):
https://www.youtube.com/playlist?list=PLSBNVhWU6KjW4qo1RlmR7cvvV8XIILub6

_Note_: After watching Video No. 13, watch No. 18 (the videos are incorrectly numbered/ordered)

## crypto-config
- A folder which keeps all crypto material of different entities. 
	-- Orderers and Peers are the two main entities whose crypto material is stored under this folder.
	-- Organizations providing (hosting) orderers in the network will have their crypto material (all ) 
  

### Steps (follow this sequence strictly):
#### <a name="#networkup"></a>Sequence to start a network:   
NOTE: If you receive any DeltaSet error and find 'unknown authority error' in orderer logs, 
perform a clean up using the long command given in [Cleanup](#cleanup)

1. Crypto step: After modifications to `crypto-config.yaml` file (if required), run `./myscripts/create-crypto.sh`
2. Genesis step: After modifications to `configtx.yaml` file (if required), run `./myscripts/create-genesis.sh`
3. NetworkUp step: Run `docker-compose down; docker volume prune -f; docker-compose up -d`
4. ChannelCreate step: To start the channel, Run `./myscripts/createChannel.sh`


#### Sequence to add a new orderer (Static i.e. when you _don't_ have the network up & running):

1. Update `crypto-config.yaml` with new orderer's name (also give SANS so that it recognizes 'localhost' & '127.0.0.1' _if ever_ referred in createChannel)  
2. Update `configtx.yaml` such as:
	- The `OrdererEndpoints` key (under 'Organizations/&OrdererOrg') has new orderer's container name with port.
	- (Since Raft is recommended starting from v2.0)  
	Add the new Orderer under 'Orderer/EtcdRaft/Consenters' as shown in below example:  
	```
	- Host: ordererN.example.com (or whichever name you gave in 				crypto-config.. just make sure it is written 				 in the 'Hostname.Domain' syntax ~ explained in 				crypto-config yaml file)
      Port: 8050 
      ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/ordererN.example.com/tls/server.crt
      ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/ordererN.example.com/tls/server.crt
	```  
3. (Optional) Update the base docker-compose files under 'base' directory (useful if you want to modularize your main docker-compose file)  (To know what I changed, check the "Checkpoint commit: Successfully added second orderer" commit diff)
4. Use the long cleanup command to remove old crypto material (especially 'crypto' and 'fabric' directories)    
5. Follow the [sequence to start network](#networkup) as it is.  
  
- To verify whether there are two orderers communicating (they will send heartbeat messages ~ a feature of Raft to know if they are present or not), use the following command:  
`watch --color docker logs --since 5s orderer.example.com `  

--- 
#### <a name="cleanup"></a>Cleanup 
While cleanup, make sure to remove `crypto` and `fabric` folders from the network's directory (these contain an older version of your network crypto material - the CAs present in these won't recognize the new entities you added in configuration):

`sudo rm -r ../{crypto,fabric};`  
The curly braces is the _bash_ syntax to combine: `../crypto` & `../fabric` 
  
Full/Long clean up command:
`sudo rm -r ../{crypto,fabric,crypto-config,channel-artifacts/genesis.block,channel-artifacts/ofss-mum.tx`

- Make sure to replace "ofss-mum" with $CHANNEL_NAME value.

