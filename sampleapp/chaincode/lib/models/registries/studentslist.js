// Utility class for collections of ledger states --  a state list
const StateList = require('./../../../ledger-api/statelist.js');

const Students = require('../students.js');

class StudentsList extends StateList {

    constructor(ctx) {
        super(ctx, StudentsList.getClass());
        this.ctx = ctx;
        this.use(Students);
    }

    async addStudent(student) {
        return this.addState(student);
    }

    async getStudent(studentId) {
        return this.getState(studentId);
    }

    async updateStudent(student) {
        return this.updateState(student);
    }

    async deleteStudent(student) {
        return this.deleteState(student);
    }
    
    async getAllStudents(){
        console.log("Getting all students...");
        let result = [];
        const query = JSON.stringify({
            "selector": {
                "_id": {
                    "$regex":StudentsList.getClass()
                }
            }
        })
        for await (const res of this.ctx.stub.getQueryResult(query)){
            // console.log("res:\n ",res.value.toString('utf8'));
            result.push(JSON.parse(res.value.toString('utf-8')));
        }
        return result;
    }
    static getClass() {
        return "org.learningnet.studentslist";
    }
}

module.exports = StudentsList;
