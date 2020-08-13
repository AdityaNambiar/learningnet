# Node Middleware
A Hyperledger Fabric **client application** that can interact with the Chaincode API.

I have not written a frontend because I intended to test using [Postman](https://www.postman.com/) (Super handy to work with). I have included the Postman API requests in the form of a collection, at the bottom of this README.

`fabric-artifacts` - consist of all the important artifacts (files basically) that are essential to run Fabric client application.  
`Fabric_CA_tryitout.md` - a **very useful** guide that can help you understand how to perform a Hands-On with Fabric CA Client CLI. Also helps in clearing up some of the terminology (only those which are utilized in the routes/utilies)

For people new to NodeJS,
`routes` & `utilities` - (_not fabric specific_) these folders consist of the files that take care of the client requests.  
`index.js` - (_not fabric specific_) Index file for requests and initial setup.  
`package.json` - (_not fabric specific_) consists of list of dependencies installed.  
`package-lock.json` is just an elaborated version of `package.json`.

Postman API collection:  
https://www.getpostman.com/collections/69d5467817119bd15768
