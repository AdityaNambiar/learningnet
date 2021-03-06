const MyNetwork  = require('../utilities/MyNetwork');
const express = require('express');
// const config = require('config');
const transactionType = "deleteStudent";
const auth = require('../utilities/auth');
const exportCard = require('../utilities/exportCard')
 
const router = express.Router();

/**
 * Algorithm:
 * 1. Initiliaze network.
 * 2. Get user from wallet.
 * 3. Connect to network via gateway.
 * 4. Setup the transaction params
 * 5. Submit or send a query (evaluate) Transaction.
 * 6. Initiliaze listener for transaction.
 * 7. As soon as data is received in callback, send it back as route response.
 */

router.post('/', auth, async (req,res)=>{
    let listener, contract, response;
    try {
        const network = new MyNetwork('lnet-1', 'learningnet-chaincode','');
        
        const username = req.username;
        const sID = req.body.pIdentifier; // Route will pass the student ID which needs to be removed. 

        // Fetch the user from wallet.
        const userIdentity = await (await network.getFSWallet())
                                          .get(username);
        
        // console.log("Received userIdentity: \n", userIdentity);
        if (!userIdentity) {
            console.log(`An identity for the user ${username} not registered and hence not in wallet.`);
            response = {
                message: "[ERROR] Given user not present in wallet. Please register first via 'addStudent' route",
            }
            return res.status(400).send(response);
        }
        
        // Make a connect to gateway and take the smart contract object to perform transactions.
        contract = await network.connect(userIdentity);
        
        // Prepare transaction arguments.
        // I need to stringify because I am parsing this JSON in my chaincode which means I expect a JSON formatted string in the argument.
        
        const studentId = JSON.stringify({
            id: sID
        });

        // Perform transaction.
        let result = await contract.submitTransaction(transactionType, studentId);
        
        // 
        listener = await contract.addContractListener((event) => {
            response = { 
                message: `Deleted student of ${sID} successfully!`,
                result: JSON.parse(result.toString()),
                payload: event
            }
        });
        contract.removeContractListener(listener);
        return res.status(200).send(response);
    } catch(err) {
        response = { 
            message: "[ERROR] Could not add the student: \n " + err
        }
        return res.status(400).send(response);
    }
})

module.exports = router;