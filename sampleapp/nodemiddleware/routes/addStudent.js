const MyNetwork  = require('../utilities/MyNetwork');
// const config = require('config');
const transactionType = "addStudent";
const express = require('express');
const auth = require('../utilities/auth');
const path = require('path')
const exportCard = require('../utilities/exportCard')
const fs = require('fs');
const router = express.Router();
 

/**
 * Algorithm:
 * 1. Initiliaze network.
 * 2. Register and get user from wallet. If already exists, then set response (400) as this error.
 * 3. Connect to network via gateway.
 * 4. Setup the transaction params
 * 5. Submit or send a query (evaluate) Transaction.
 * 6. Initiliaze listener for transaction.
 * 7. As soon as data is received in callback, send it back as route response.
 */

router.post('/', async (req,res)=>{
    let listener, contract, response;
    try {
        // Copy channel name from 'deployChaincode.sh' script.
        // Chaincode name must be copied from 'package.json' under ../../chaincode/ (chaincode folder under sampleapp)
        const network = new MyNetwork('lnet-1', 'learningnet-chaincode','');
        
        const username = req.body.username;
        const password = req.body.password;
        const pType = req.body.pType;
        const pIdentifier = req.body.pIdentifier;
        const orgName = req.body.orgName;
        const deptName = req.body.deptName;

        const gradeId = req.body.gradeId;
        const totalGrade = req.body.totalGrade;

        // Register and get the user from wallet.
        const user = await network.getRegisteredUser(username,password, pType, pIdentifier, orgName, deptName);
        
        // Make a connect to gateway and take the smart contract object to perform transactions.
        contract = await network.connect(user.identity);
        
        // Prepare transaction arguments.
        // I need to stringify because I am parsing this JSON in my chaincode which means I expect a JSON formatted string in the argument.
        const newStudent = JSON.stringify({
            id: pIdentifier,
            name: username,
            year: pType   
        });
        const gradeKey = JSON.stringify({
            id: gradeId,
            totalGrade: totalGrade
        });
        console.log(gradeKey);
        // Perform transaction.
        let result = await contract.submitTransaction(transactionType, newStudent, gradeKey);
        
        console.log("USER: \n",user.user);
        const token = await network.generateAccessToken(username, pType, pIdentifier);

        listener = await contract.addContractListener((event) => {
            response = { 
                message: "Added student successfully!",
                result: result.toString(),
                payload: event,
                token: token
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