// Utility class for collections of ledger states --  a state list
const StateList = require('./../../../ledger-api/statelist.js');

const Grades = require('../grades.js');

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
    async getAllGrades(){
        console.log("Getting all grades...");
        let result = [];
        const query = JSON.stringify({
            "selector": {
                "_id": {
                    "$regex":GradesList.getClass()
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
        return 'org.learningnet.gradeslist';
    }
}


module.exports = GradesList;
