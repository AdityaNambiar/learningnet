const { Contract } = require('fabric-contract-api');

class SampleAppContract extends Contract {
    constructor(){
        this.contractname = 'org.learningnet.sampleappcontract';
        super(this.contractname);
    }

    /**
     * For initialization.
     * Will be called during installation as well as on updates (I.E. Everytime peer has to load the smartcontract)
     */
    async init() { 
        console.log("Initialized ", this.contractname);
    }

    async getName(ctx, name){
        try {
            
        } catch(err) {
            throw new Error(err);
        }
    }
    
}