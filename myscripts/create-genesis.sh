<<"comment"
Here we will be using 'configtxgen command and describing its usage

configtxgen is used for only 3 things:
1. Create an 'orderer genesis block' 
	- used to "bootstrap" (prepare) orderers incase they went down.
2. channel (system channel) configuration transaction ($CHANNEL_NAME.tx file)
	- used to generate the genesis block
3. anchor peer configuration transaction (using same profile as used for channel configuration block's)
	- there are 4 commands due to the fact that we have two organizations and for each we 
	  need to create anchor peers configuration transaction.

NOTE: configtxgen will NOT allow configtx.yaml to be renamed. Tested and found it out, gives [ Unsupported Config Type "" ] error. 
	  This error can have different meanings but in our case here, it means it could not find the config file.

To find out whats inside 'CHANNEL_NAME.tx / genesis block' and also to understand why 'orderer genesis block' is made, refer to:
https://stackoverflow.com/a/57562829  
comment

if [ -d ./channel-artifacts/ ]; then
	echo "Emptying channel-artifacts...";
	sudo rm -rf ./channel-artifacts/*
fi
export SYS_CHANNEL_NAME="lnet-sys"
export CHANNEL_NAME="lnet-1"
export CORE_PEER_LOCALMSPID_org1="Org1MSP"
export CORE_PEER_LOCALMSPID_org2="Org2MSP"

# Generating orderer genesis block, giving system channel name:
configtxgen -profile TwoPeerTwoOrdererGenesisProfile -configPath . -channelID $SYS_CHANNEL_NAME -outputBlock ./channel-artifacts/genesis.block
# Generating configuration transaction to establish a channel of given CHANNEL_NAME:
configtxgen -profile TwoOrgsChannel -configPath . -channelID $CHANNEL_NAME -outputCreateChannelTx ./channel-artifacts/$CHANNEL_NAME.tx 

# Creating configuration transaction for Anchor peer of Org1
echo "#######    Generating anchor peer update for ${CORE_PEER_LOCALMSPID_org1}  ##########"
configtxgen -profile TwoOrgsChannel -configPath . \
	-outputAnchorPeersUpdate ./channel-artifacts/${CORE_PEER_LOCALMSPID_org1}anchors.tx \
	-channelID $CHANNEL_NAME -asOrg ${CORE_PEER_LOCALMSPID_org1}

# Creating configuration transaction for Anchor peer of Org2
echo "#######    Generating anchor peer update for ${CORE_PEER_LOCALMSPID_org2}  ##########"
configtxgen -profile TwoOrgsChannel -configPath . \
	-outputAnchorPeersUpdate ./channel-artifacts/${CORE_PEER_LOCALMSPID_org2}anchors.tx \
	-channelID $CHANNEL_NAME -asOrg ${CORE_PEER_LOCALMSPID_org2}