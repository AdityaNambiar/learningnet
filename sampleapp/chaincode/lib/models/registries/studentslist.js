// Utility class for collections of ledger states --  a state list
const StateList = require('./../../../ledger-api/statelist.js');

const Students = require('../students.js');

class StudentsList extends StateList {

    constructor(ctx) {
        super(ctx, StudentsList.getClass());
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
    s
    static getClass() {
        return 'org.learningnet.studentslist';
    }
}


module.exports = StudentsList;
