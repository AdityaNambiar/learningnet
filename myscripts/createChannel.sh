<< 'channel' 
All environment variables starting with "CORE_" are part of the core.yaml file.
So the answer to "why these many environment variables?" - if these weren't to be set, then you'd be changing stuff in that yaml file which is too long and can be confusing.

Q. Why provide Root CA certificate path? 
A. 1. Entities that communicate with each other while having TLS enabled will require certificates of each other
   2. Once an entity receives a certificate, it will be verifying the authority by going through the list of Root CAs (where the CA's cert is present)
      Eg: For firefox browser, here's the list of CAs it trusts: https://ccadb-public.secure.force.com/mozilla/CACertificatesInFirefoxReport
        -- To see the known CAs such as DigiCert, LetsEncrypt, GoDaddy or Google LLC, you can ctrl+f and search for their names (example search for "godaddy")
        -- To see their individual CA certificates, copy their "Root Certificate Name" and search on google for it. You'll get a download link or you'll be able to view them.
   3. So just like how browsers verify a website's authenticity, these Fabric entities also will do the same using the Root CA's path given to them

   So we provide the Root CA certificate path to include the certificate from which the server.cert (tls public key/certificate) and server.key (tls private key) came into being.

channel
export CORE_PEER_TLS_ENABLED=true # A- We will be having TLS Communication ENABLED.
# Orderer's Root CA certificate (A way to trust this Root CA) path:
export ORDERER_CA=../crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
# Peer0 of Org1's Root CA certificate path:
export PEER0_ORG1_CA=../crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
# Peer0 of Org2's Root CA certificate path:
export PEER0_ORG2_CA=../crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
# Path to config folder which is packaged within fabric-samples (it contains 3 yaml files: configtx, core, orderer...yaml files)
export FABRIC_CFG_PATH=./config/

export CHANNEL_NAME="lnet-1"

setGlobalsForOrderer(){
    # A- Don't replace ROOTCERT_FILE path with ORDERER_CA because if this function is called from elsewhere it won't be able to fetch the value of $ORDERER_CA
    export CORE_PEER_LOCALMSPID="OrdererMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=../crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
    export CORE_PEER_MSPCONFIGPATH=../crypto-config/ordererOrganizations/example.com/users/Admin@example.com/msp
    
}

setGlobalsForPeer0Org1(){
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA 
    export CORE_PEER_MSPCONFIGPATH=../crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

setGlobalsForPeer1Org1(){
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
    export CORE_PEER_MSPCONFIGPATH=../crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:8051
    
}

setGlobalsForPeer0Org2(){
    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
    export CORE_PEER_MSPCONFIGPATH=../crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
    
}

setGlobalsForPeer1Org2(){
    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
    export CORE_PEER_MSPCONFIGPATH=../crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:10051
    
}

createChannel(){
    # A- I'm not willing to remove channel-artifacts folder only because I have my genesis.block & channel config .tx file placed there. Let's see what happens
    #rm -rf ../channel-artifacts/*
    # setGlobalsForPeer0Org1 = set the global env variables for the current instance of terminal (in which this script will be run) for peer0 of org1
    setGlobalsForPeer0Org1
    
    # Using peer binary (which means 'command') to create channel.
    # -o = orderer address
    # -c = channel name
    # --orderTLSHostnameOverride = name of orderer container
    # -f = path to channel configuration transaction (Generated by configtxgen) - named as $CHANNEL_NAME.tx
    # --outputBlock = the channel's initial (don't know if I should call this genesis block because orderer has the true/very first genesis block) block (can be inspected by configtxlator command)
    # --tls = boolean value to decide whether to use TLS communication when talking with orderer or not.
    # --cafile = orderer's root CA path
    # For more info: just type 'peer channel' to see help information 
    echo -e -n "\n\nCreating channel...\n"
    peer channel create -o localhost:7050 -c $CHANNEL_NAME \
    --ordererTLSHostnameOverride orderer.example.com \
    -f ./channel-artifacts/$CHANNEL_NAME.tx --outputBlock ./channel-artifacts/$CHANNEL_NAME.block \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA

}

# removeOldCrypto(){
#     rm -rf ./api-1.4/crypto/*
#     rm -rf ./api-1.4/fabric-client-kv-org1/*
# }


joinChannel(){
    echo "Joining channel..."
    # Why do we set global env variables before each peer command as seen below?
    # Ans: These commands will point to the appropriate peer when executing commands on terminal 
    #      by setting environment variables (Which will override the config/core.yaml values for peer)
    #      Unfortunately, there is no single direct documentation to pick up these environment variables,
    #      But if you have completed their BYFN tutorial (or some other tutorial), you'd be able to know which ENV variables to copy and paste in your script
    #      
    #      Basically, there are 2/3 things that these ENV variables add to the terminal instance...:
    #      1. (If you want TLS communication) a boolean value to know if TLS is enabled or not
    #      2. (If TLS is enabled) The TLS Root certificate which will be used during communication.
    #      3. Peer's MSP ID (what you wrote in configtx.yaml for MSP ID under Organization/<peerOrganization>'s configuration for "ID: ")
    #      4. Peer's MSP config path (the msp directory of the Admin user of a specific peerOrganization)
    #      5. Address of the Peer, i.e. IP + Port.
    setGlobalsForPeer0Org1
    # After we have used one peer to create a channel for all entities... 
    # ...next we will be using the '.block' file to connect all other peers to channel
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
    setGlobalsForPeer1Org1
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
    setGlobalsForPeer0Org2
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
    setGlobalsForPeer1Org2
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
}

updateAnchorPeers(){
    echo "Updating anchor peers on channel..."
    # We will now update the channel to identify Peer0 of org1 to become anchor peer for org1.
    # The peer you choose over here MUST be the one that you defined to be made 'AnchorPeer' 
    # ... under Organization/<peerOrganization>'s configuration for "AnchorPeers: "
    setGlobalsForPeer0Org1
    peer channel update -o localhost:7050 -c $CHANNEL_NAME \
    --ordererTLSHostnameOverride orderer.example.com \
     -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
    # We will now update the channel to identify Peer0 of org2 to become anchor peer for org2.
    setGlobalsForPeer0Org2
    peer channel update -o localhost:7050 -c $CHANNEL_NAME \
    --ordererTLSHostnameOverride orderer.example.com \
    -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
}

#removeOldCrypto
createChannel
joinChannel
updateAnchorPeers