const listener = await addContractListener((event) => {
                callback(event) // in processEvents.js
                finalResponse = event // below
                res.status(200).send(finalResponse);
})