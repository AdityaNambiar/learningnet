# Multiline comment syntax - 
# "comment" is just a word.. it could be anything. For more info about this syntax, search HERE Document style comment
<< 'comment' 
First we will generate the Crypto material (artifacts) 
for all entities in our network:

Entities right now:
1 ordererOrganization (organization which is providing an orderer)
2 peerOrganizations (orgs of which peers will be present on the network)
comment

cryptogen generate --config=../crypto-config.yaml --output=../crypto-config