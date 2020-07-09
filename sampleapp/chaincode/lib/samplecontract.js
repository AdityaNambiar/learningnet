const { Contract } = require('fabric-contract-api');

class SampleAppContract extends Contract {
    constructor(){
        super('org.learningnet.sampleappcontract'); // Must call super() before 'this'
        this.contractname = 'org.learningnet.sampleappcontract';

        this.assets = {
            student: {
                id: '',
                grades: ''
            }
        }
    }

    /**
     * For initialization.
     * Will be called during installation as well as on updates (I.E. Everytime peer has to load the smartcontract)
     */
    async initStudRecords(ctx) { 
        this.assets.student.id = '0'
        this.assets.student.grades = "100/100"
        await ctx.stub.putState('0', Buffer.from(JSON.stringify(this.assets.student)));
        console.log("Initialized ", this.contractname);
    }
    async showStudents(ctx){
        try {
            console.log("Retrieving first student record...");
            const id = '0', endid = '100';
            let result = []
            for await(const res of ctx.stub.getStateByRange(id, endid)) {
                result.push(res.value.toString('utf-8')); // Returns an array of results
            }
            return result;
        } catch(err) {
            throw new Error(`showStudents error: ${err}`);
        }
    }
    async getStudent(ctx, id) {
        try {

            //const key = ctx.stub.createCompositeKey(this.contractname, [id]);
            const studRecordAsBytes = await ctx.stub.getState(id);
            if (!studRecordAsBytes || studRecordAsBytes.toString().length <= 0){
                throw new Error(`No student of id: '${id}' found!`);
            }
            const studRecord = JSON.parse(studRecordAsBytes.toString());
            return JSON.stringify(studRecord);

        } catch(err) {
            throw new Error(`getStudent error: ${err}`)
        }
    }
    async addStudent(ctx, id, grades){
        try {

            this.assets.student.id = id;
            this.assets.student.grades = grades;

            //const key = ctx.stub.createCompositeKey(this.contractname, [id]);
            await ctx.stub.putState(id, Buffer.from(JSON.stringify(this.assets.student)));
            
            return "Added student details successfully!";

        } catch(err) {
            throw new Error(`addStudent error: ${err}`);
        }
    }
    
    async updateStudent(ctx, id, grades){
        try {

            //const key = ctx.stub.createCompositeKey(this.contractname, [id]);
            const studRecordAsBytes = await ctx.stub.getState(id);
            if (!studRecordAsBytes || studRecordAsBytes.toString().length <= 0){
                throw new Error(`No student of id: '${id}' found!`);
            }
            const studRecord = JSON.parse(studRecordAsBytes.toString());
            studRecord.grades = grades;
            await ctx.stub.putState(id, Buffer.from(JSON.stringify(studRecord)));
            return "Updated student grades successfully!";

        } catch(err){
            throw new Error(`updateStudent error: ${err}`);
        }
    }

    async deleteStudent(ctx, id){
        try {
            console.log(this.assets);
            //const key = ctx.stub.createCompositeKey(this.contractname, [id]);
            await ctx.stub.deleteState(id);
            return "Student record deleted successfully!\n"+this.assets;

        } catch(err) {
            throw new Error(`deleteStudent error: ${err}`);
        }
    }
}

module.exports = SampleAppContract;