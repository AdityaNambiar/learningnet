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
        this.gradeList = new GradesList(this); // Instantiates this variable "gradeslist" with GradesList methods & properties and also pass 'this' which is the context of the smart contract to be able to access the stub. 
        this.studentList = new StudentsList(this);
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
     * FEW POINTS TO REMEMBER:
     * 1. The only purpose of init functions are, to name a few, populate ledgers or set some data migration tasks (don't know what this means and how this works) 
     * @param {Context} ctx Contains context (including custom defined context)
     */
    /**
     *  Purpose of function: To populate the ledger by adding one student with full grades on all subjects.
     *  Algorithm:
     *  1. Create 'grades' asset(s) 
     *  2. Create student asset(s) or "participant".
     *  3. Assign the grade to student. (i.e. assigning asset to participant ~ justifying relationship between participant and asset)
     *  3. Add the world state with new student and new grade.
     */
    async initStudRecords(ctx) { 
        
        // Create 'grades' asset(s):
        const id = 0;
        const subA = 100;
        const subB = 100;
        const subC = 100;
        const totalGrade = subA+subB+subC;
        const grade2 = { 
            id: 1,
            subA: 99,
            subB: 99,
            subC: 99,
            totalGrade: 99+99+99 
        }
        const grade = Grades.createInstance({ id, subA, subB, subC, totalGrade });
        const g2 = Grades.createInstance(grade2);

        // Add grades to world state and ledger
        await ctx.gradeList.addGrades(grade);
        await ctx.gradeList.addGrades(g2);

        // Create student asset(s) or "participant".
        const studentobj = {
            id: 0,
            name: 'Ezio Auditore',
            year: 'second',
            grade: grade
        }
        const studentobj2 = {
            id: 1,
            name: 'Altair da Masyaf',
            year: 'first',
            grade: g2
        }
        // Add students to world state and ledger
        const student = Students.createInstance(studentobj);
        const student2 = Students.createInstance(studentobj2);
        await ctx.studentList.addStudent(student);
        await ctx.studentList.addStudent(student2);

        const studKey = Students.makeKey([studentobj2.id])
        const stud = await ctx.studentList.getStudent(studKey);

        return { 
            msg:`Initialized ${this.contractname}`,
            student: stud
        };
    }
    async showGrades(ctx){
        try {
            const grades = await ctx.gradeList.getAllGrades();
            return { 
                msg: "List of all grades",
                result: grades
            };
        } catch(err) {
            throw new Error(`showGrades error: ${err}`);
        }
    }
    async showStudents(ctx){
        try {
            const students = await ctx.studentList.getAllStudents();
            return { 
                msg: "List of all students",
                result: students
            };
        } catch(err) {
            throw new Error(`showStudents error: ${err}`);
        }
    }

    /**
     * Adds a new student
     * @param {Context} ctx - Context object
     * @param {object} addStudentObj - The new student's details
     * @param {object} gradeKey - A grade object if user wants to use assign an existing grade to this new student.
     * @returns {object} An object showing success message and the student that was just added to the ledger / world state.
     */
    async addStudent(ctx, addStudentObj, gradeKey){
        try {
            const obj = JSON.parse(addStudentObj);
            const gradeKeyObj = JSON.parse(gradeKey);
            if (!(gradeKeyObj.id).toString() || !(gradeKeyObj.totalGrade).toString()){ 
            // id & totalGrade are integers. An int value can also be '0' leading to falsifying this condition. Hence we convert to string indicating it as actual value and not a boolean.
                throw new Error("No ID or totalGrade property provided in gradeKey");
            }
            const key = Grades.makeKey([gradeKeyObj.id, gradeKeyObj.totalGrade])
            const grades = await ctx.gradeList.getGrades(key)
            const newStudentObj = {
                id: parseInt(obj.id),
                name: obj.name,
                year: obj.year,
                grades: grades
            }
            const newStudent = Students.createInstance(newStudentObj);
            await ctx.studentList.addStudent(newStudent);

            return {
                successMsg: "Added new student successfully!",
                newStudent: newStudent
            }
        } catch(err) {
            throw new Error(`addStudent error: ${err}`);
        }
    }
    /**
     * 
     * @param {Context} ctx - Context object 
     * @param {object} studentKey - An object that consist of student assets unique properties that were predecided (when we were forming the ledger API and Student class constructor). 
     * In this case, it's their "id"
     * @returns {object} An object showing success message and the student from the world state.
     */
    async getStudent(ctx, studentKey) {
        try {
            const studentKeyObj = JSON.parse(studentKey);
            // Ledger API methodology requires us to form a key (because composite keys are utilized) and then request for states
            if (!(studentKeyObj.id).toString()){
                throw new Error("No ID property provided for studentKey");
            }
            const key = Students.makeKey([studentKeyObj.id])
            const student = await ctx.studentList.getStudent(key);
            return {
                getStudent: student
            }
        } catch(err) {
            throw new Error(`getStudent error: ${err}`)
        }
    }
    async updateStudent(ctx, updateStudentObj){
        try {

            const obj = JSON.parse(updateStudentObj);
            // Here we do not require to use the getters defined in Grade or Student class because we are receiving an updated object which we simply insert into world state / ledger. 
            const grade = Grades.createInstance(obj.grades);
            const studentObj = {
                id: parseInt(obj.id),
                name: obj.name,
                year: obj.year,
                grades: grade
            }
            const student = Students.createInstance(studentObj);
            await ctx.studentList.updateStudent(student);

            return {
                successMsg: "Updated student successfully!",
                updatedStudent: student
            }

        } catch(err){
            throw new Error(`updateStudent error: ${err}`);
        }
    }

    async deleteStudent(ctx, studentKey){
        try {

            const studentKeyObj = JSON.parse(studentKey);
            // Just like getStudent, here we need to form a key (because composite keys are utilized) and then delete an asset state (the student of given id)
            if (!(studentKeyObj.id).toString()){
                throw new Error("No ID property provided for studentKey");
            }
            const key = Students.makeKey([studentKeyObj.id])
            await ctx.studentList.deleteStudent(key);
            return { 
                successMsg: "Student record deleted successfully!",
                removedID: key
            }

        } catch(err) {
            throw new Error(`deleteStudent error: ${err}`);
        }
    }

    async afterTransaction(ctx, result){
        console.log("Triggered transactionEvent!", result);
        await ctx.stub.setEvent("transactionEvent", Buffer.from(JSON.stringify(result))); 
        // ^Stringify is required because among many types of args for 'Buffer.from()'  one of them is string type and NOT object.
    }
}

module.exports = SampleAppContract;