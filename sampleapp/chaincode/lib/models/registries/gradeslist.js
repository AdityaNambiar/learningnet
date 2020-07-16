// Utility class for collections of ledger states --  a state list
const StateList = require('./../../../ledger-api/statelist.js');

const Grades = require('../../grades.js');

class GradesList extends StateList {

    constructor(ctx) {
        super(ctx, GradesList.getClass());
        this.use(Grades);
    }

    async addGrades(grades) {
        return this.addState(grades);
    }

    async getGrades(gradesKey) {
        return this.getState(gradesKey);
    }

    async updateGrades(grades) {
        return this.updateState(grades);
    }

    async deleteGrades(grades) {
        return this.deleteState(grades);
    }
    s
    static getClass() {
        return 'org.learningnet.gradeslist';
    }
}


module.exports = GradesList;
