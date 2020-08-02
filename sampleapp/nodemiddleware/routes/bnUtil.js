const MyNetwork  = require('../utilities/MyNetwork');
// const config = require('config');
const auth = require('../utilities/auth')
const express = require('express');
const path = require('path')
const exportCard = require('../utilities/exportCard')
const fs = require('fs');
const { Wallet } = require('fabric-network');
const router = express.Router();
 

/**
 * Algorithm:
 * 1. Initiliaze network.
 * 2. Register and get user from wallet.
 * 3. Connect to network via gateway.
 * 4. 
 */

router.post('/login', async (req,res)=>{
    let response;
    try {
        const network = new MyNetwork('lnet-1', 'learningnet-chaincode','');
        
        const username = req.body.username;
        const password = req.body.password;
        const pType = req.body.pType;
        const pIdentifier = req.body.pIdentifier;
        const orgName = req.body.orgName;
        const deptName = req.body.deptName;

        // Fetch the user from wallet.
        const userIdentity = await (await network.getFSWallet())
                                          .get(username);
        console.dir("Received userIdentity: \n", userIdentity);
        if (!userIdentity) {
            console.log(`An identity for the user ${username} not registered and hence not in wallet.`);
            response = {
                message: "[ERROR] Given user not present in wallet. Please register first via 'addStudent' route",
            }
            return res.status(400).send(response);
        }
        const user = await (await network.getFSWallet())
                                  .getProviderRegistry()
                                  .getProvider(userIdentity.type)
                                  .getUserContext(userIdentity,username);
        console.log("USER: \n",user);
        const token = await network.generateAccessToken(username, pType, pIdentifier);
        response = {
            message: "Logged in successfully",
            token: token
        }
        return res.status(200).send(response);
    } catch(err) {
        response = { 
            message: "[ERROR] Could not login: " + err
        }
        return res.status(400).send(response);
    }
})
/**
 * @todo Disconnect and remove card (or identity)
 */
router.post('/logout', auth, async(req,res)=>{
    let cardName = req.cardName;
    let mynetwork = new MyNetwork(cardName);
    mynetwork.connect().then(function () {
        return mynetwork.logout()
    }).then(function () { 
        res.json({ message: "Logout Successfully" });
    }).catch(function(error) {
        console.log(error);
        res.status(500).json({ error: error.toString() })
    })
})
module.exports = router;