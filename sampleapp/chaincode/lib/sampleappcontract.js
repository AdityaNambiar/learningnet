const { Contract, Context } = require('fabric-contract-api');

const GradesList = require('./models/registries/gradeslist.js');
const StudentsList = require('./models/registries/studentslist.js');
const Grades = require('./models/grades.js');
const Students = require('./models/students.js');

/**
 * Defining a User-defined context so as to utilize the ledger-api for interacting with World State.
 */
class SampleAppContext extends Context {
    constructor() {
        super();
        this.gradeslist = new GradesList(this); // Instantiates this variable "gradeslist" with GradesList methods & properties and also pass 'this' which is the context of the smart contract to be able to access the stub. 
        this.studentslist = new StudentsList(this);
    }
}
class SampleAppContract extends Contract {

    constructor(){
        super('org.learningnet.sampleappcontract'); // Must call super() before using 'this' keyword ~ its a concept of oop and not fabric..
        this.contractname = 'org.learningnet.sampleappcontract';

        /**
         * Having our assets defined like a 'state' in ReactJS is fine. But the problem comes when
         * we start to have many users and they have their own copies of this asset.    
         *
         * For better Concurrency Control for our assets, we need to use the 
         * concept of 'Registries' as we learnt from Hyperledger Composer.
         */
        /**
         * Example of a participant:
            this.participants = {
                NetworkAdmin: {
                    pIdentifier:'',
                    pType: '',
                    fname: '',
                    lname: '',
                    dob: '',
                    phone: '',
                    email: ''
                },
                Student: {
                    pIdentifier:'',
                    pType: '',
                    fname: '',
                    lname: '',
                    dob: '',
                    phone: '',
                    email: ''
                }
            }
            - The way 'extends' is used in model file. We need to define our participants in such manner using OOP in JS.
         */
        
    }
    /**
     * This will define a custom context to be used within the class that extends 'Contract' (i.e. our smart contract)
     * @returns {SampleAppContext} Custom context defined for accessing GradesList. In simpler words, you get access to your registry's methods in `ctx` variable
     */
    createContext() {
        return new SampleAppContext();
    }
    /**
     * For initialization.
     * Will be called during installation as well as on updates (I.E. Everytime peer has to load the smartcontract)
     * @param {Context} ctx Contains context (including custom defined context)
     */
    async initStudRecords(ctx) { 
        /**
        *  Purpose of function: To populate the ledger by adding one student with full grades on all subjects.
        *  Algorithm:
        *  1. Create one 'grades' asset 
        *  2. Create one student asset or "participant".
        *  3. Assign the grade to student.
        *  3. Add the world state with new student and new grade.
        */
        // Create 'grades' asset:
        const id = Date.now();
        const subA = 100;
        const subB = 100;
        const subC = 100;
        const totalGrade = subA+subB+subC;
        const grade = Grades.createInstance({ id, subA, subB, subC, totalGrade });
        console.log("grade obj: ",grade);
        await ctx.gradeslist.addGrades(grade);
        // Create a new student:
        const studid = Date.now();
        const studname = 'Ezio';
        const studyear = 'first';
        const student = Students.createInstance({ studid, studyear, studname, grade })
        console.log("student obj: ", student);
        await ctx.studentslist.addStudent(student);
        return "Initialized "+this.contractname+"\n"+student;
    }
    async showStudents(ctx){
        try {
            
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
    async addStudent(ctx, addStudentObj){
        try {
            const obj = JSON.parse(addStudentObj);
            this.assets.student.id = obj.id;
            this.assets.student.name = obj.name;
            this.assets.student.grades = obj.grades;

            //const key = ctx.stub.createCompositeKey(this.contractname, [id]);
            await ctx.stub.putState(id, Buffer.from(JSON.stringify(this.assets.student)));
            
            return "Added student details successfully!";

        } catch(err) {
            throw new Error(`addStudent error: ${err}`);
        }
    }
    
    async updateStudent(ctx, updateStudentObj){
        try {

            const obj = JSON.parse(updateStudentObj);
            const id = obj.id;
            const grades = obj.grades;
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

    async deleteStudent(ctx, deleteStudentObj){
        try {
            const obj = JSON.parse(deleteStudentObj);
            const id = obj.id;
            //const key = ctx.stub.createCompositeKey(this.contractname, [id]);
            await ctx.stub.deleteState(id);
            return { 
                msg: "Student record deleted successfully!\n"+this.assets,
                result:''
            }

        } catch(err) {
            throw new Error(`deleteStudent error: ${err}`);
        }
    }

    async afterTransaction(ctx, result){
        await ctx.stub.setEvent("transactionEvent", result);
    }
}

module.exports = SampleAppContract;