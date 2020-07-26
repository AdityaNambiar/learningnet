const jwt = require('jsonwebtoken');
//const config = require('config');
const app = require('express')();
app.set('jwtPrivateKey', '12345');
const { AffiliationService, IdentityService } = require('fabric-ca-client'); // For adding affiliation to user and also fetch user from IdentityService
const { Gateway, Wallets } = require('fabric-network');
/**
 * The algorithm(s) provided by MyNetwork class:
 * A. Get the card using its data, then return its name. (importCardToNetwork)
 * B. Methods to connect, ping, disconnect to/from the "Business Network" 
        - To be replaced by "gateway.connect()" and such gateway methods.
 * C. Generate a JWT token which encapsulates and then encrypts the payload using jwt.sign(payload, privKey) 
 */
class MyNetwork{
    constructor(channelName, chaincodeName, cardName) {
        this.channelName = channelName;
        this.chaincodeName = chaincodeName;
        this.connection = new Gateway();
    }
    /**
     * Get the common connection profile from JSON to the JS object structure.
     * @returns {object} Common Connection Profile (ccp) object
     */
    static getCCP() {
        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', 'fabric-artifacts', 'hlf-connection-profile.json');
            const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
            const ccp = JSON.parse(ccpJSON);
            return ccp;
        } catch(err) {
            console.log("[ERROR] Could not fetch connection profile: \n", err);
        }
    }
    /**
     * Fetch the smart contract object to perform invoke (submitTransaction) or query (evaluateTransaction) requests.
     * @returns {object} Smart contract object 
     */
    async getContract(){
        try {
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(this.channelName);
            const contract = network.getContract(this.chaincodeName);
            return contract;
        } catch(err) {
            console.log("[ERROR] Problem occured trying to fetch network / smart contract: \n",err);
        }
    }
    /**
     * Some documentation links:
     * 1. Different event handler strategies: https://hyperledger.github.io/fabric-sdk-node/master/module-fabric-network.html#.DefaultEventHandlerStrategies
     * 2. Connection options docs: https://hyperledger.github.io/fabric-sdk-node/master/module-fabric-network.GatewayOptions.html
     */
    /**
     * Connects client to Fabric gateway.
     * @param {string|import('fabric-network').Identity} username Username of client 
     */
    async connect(username){
        try{
            const ccp = MyNetwork.getCCP();
            const connectOptions = {
                wallet, 
                identity: username, 
                discovery: { 
                    enabled: true,
                    asLocalhost: true 
                },
                eventHandlerOptions: {
                    strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX
                }
            }  
            await gateway.connect(ccp, connectOptions);
        } catch(err){
            console.log("[ERROR] Could not connect to gateway: \n", err);
        }
    }
    
    /**
     * Clears the fetched client identity from filesystem (wallet/)
     */
    async logout(){
    }
    /**
     * Disconnects client from Fabric Gateway.
     */
    async disconnect(){
        try {
            await gateway.disconnect();
        } catch(err) {
            console.log("[ERROR] Could not disconnect from gateway: \n", err);
        }
    } 
    /**
     * generateAccessToken(username){
         return new Promise((resolve, reject) => {
            let privateKey = config.get("jwtPrivateKey");
            if (!privateKey) {
                console.log("Private key not found");
            }
            // Get all identities from CAs 
         })
       } 
     */
   generateAccesToken(idCardName){
        return new Promise((resolve,reject)=>{
            let privateKey = app.get("jwtPrivateKey");
            if(!privateKey){
                console.log("Private key not found");
            
            }
            let identityService = new IdentityService(); 
            let bnc = new BusinessNetworkConnection();
            bnc.connect(idCardName);
            bnc.connect(idCardName).then(connections=>{
                bnc.getIdentityRegistry().then(identityRegistry=>{
                    identityRegistry.getAll().then(identities=>{
                        let pIdentifier  = idCardName.split('@erp')[0];
                        // console.log("pIdentifier=>",pIdentifier);
                        console.log(pIdentifier)
                        let pType = null;
                        for(let i=0;i<identities.length;i++){
                                let identity = identities[i];
                                let type = identity.participant.$type;
                                if(pIdentifier==identity.participant.$identifier){
                                    pType = type;
                                    break;
                                }
                            }   
                            const token = jwt.sign({"cardName":idCardName,"pType":pType},privateKey)
                            console.log(token);
                            resolve(token);
                    }).catch(error=>{})
                }).catch(error=>{})
            }).catch(error=>{})
                
            
        })    
    }
}

module.exports = MyNetwork; 