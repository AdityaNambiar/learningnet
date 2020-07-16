/**
 * Bringing in the ledger-api to handle States of our asset
 */
const State = require('../../ledger-api/state.js');
/**
 * Grade asset:
   ```
    grades = {
        id: timestampVal,  // unique identifier for a grade asset
        subA: int,
        subB: int,
        subC: int,
        totalGrade: int
    }
   ```
 */
class Grades extends State {
    constructor(obj) {
        super(Grades.getClass(),[obj.id, obj.totalGrade]);
        Object.assign(this,obj); // Another reason (previously explained this line in paper.js) why this line is necessary is because of JSON.stringify(this) in toBuffer()
    }
    /** Basic getters and setters */
    getGrades() {
        return this;
    }
    setGrades(newGrades) {
        Object.assign(this,newGrades);
    }
    static fromBuffer(buffer) {
        return Grades.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this)); 
    }

    /**
     * Deserialize a state data to grades
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Grades);
    }
    
    /**
     * Factory method to create a grade asset object
     * https://stackoverflow.com/questions/628950/constructors-vs-factory-methods
     * This indeed does the same as if you used the 'new' keyword BUT this lets us have additional flexibility by which the chaincode doesnt worry about getting changed if we change anything in this file or method.
     */
    static createInstance(obj) {
        return new Grades(obj);  
    }
    /**
     * Static method to return the namespace. The idea to write this was taken from from `papercontract.js`. 
     * This is a user-defined method and not from fabric. 
     * @returns {String} namespace of the smart contract
     */
    static getClass() {
        return 'org.learningnet.sampleappcontract';
    }
}

module.exports = Grades;