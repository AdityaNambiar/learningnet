const jwt = require('jsonwebtoken');
//const config = require('config');
const app = require('express')();
app.set('jwtPrivateKey', '12345')
const { AffiliationService, IdentityService } = require('fabric-ca-client'); // For adding affiliation to user and also fetch user from IdentityService
const { Gateway, Wallets } = require('fabric-network');
/**
 * The algorithm(s) provided by MyNetwork class:
 * A. Get the card using its data, then return its name.
 * B. Methods to connect, ping, disconnect to/from the "Business Network" 
        - To be replaced by "gateway.connect()" and such gateway methods.
 * C. Generate a JWT token which encapsulates and then encrypts the payload (1st param) using jwt.sign() 
 */
class MyNetwork{
    constructor(cardName) {
    }
    async connect(){
    }
    async logout(){
    }
    async disconnect(){
    } 
    /**
     * generateAccessToken(username){
         return new Promise((resolve, reject) => {
            let privateKey = config.get("jwtPrivateKey");
            if (!privateKey) {
                console.log("Private key not found");
            }
            // Get all identities from wallet 
         })
       } 
     */
   generateAccesToken(idCardName){
        return new Promise((resolve,reject)=>{
            let privateKey = app.get("jwtPrivateKey");
            if(!privateKey){
                console.log("Private key not found");
            
            }
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