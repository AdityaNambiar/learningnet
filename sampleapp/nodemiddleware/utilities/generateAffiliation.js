/**
 * Generates and returns an Affiliation object for a user trying to register themself.
 * - Affiliations are useful when we want to officially assign a designation to a user. 
 * - In Hyperledger Composer, we used to use 'Participant Type' to designate a user by their role in the company. E.g. Network Admin, Director, Technician etc.
     In Fabric SDK, we'll be, by standards, assigning this **categorization of user** in their identity  as affiliation.
 * - Affiliations are NOT key-value pairs (unlike Attributes). So make sure to use them for their purpose itself i.e. to "affiliate" somebody to something.
 * Example of Affiliation for a college student:-
 * - In a sentence: John is a student in the IT department of TCET
 * - By affiliation syntax: 
    affiliation: TCET
      affiliation: TCET.IT
        affiliation: TCET.IT.Student
 */

const { AffiliationService, IdentityService } = require('fabric-ca-client'); // For adding affiliation to user and also fetch user from IdentityService
const { User } = require('fabric-client');
/**
 * Generates affiliation for user as string.
 * Expected params:
 * @param entites Array of affiliation hierarchy. **The last element must be the registrar (identity who is performing registration)** 
 * 'User' can be a username.
 * @example [orgA, deptA, deptB, User]
 */


module.exports.generateAffiliation = (...entities) => {
  console.log(entities);
  const username = entities.slice(-1)[0];
  const user = new User(username);
  const affStr = entities.join('.');
  const affiliationService = new AffiliationService();
  const response = affiliationService.create({
    name: affStr,
    force: true
  }, user);
  console.log("ServiceResponse: \n", response);
  if (response.success){
    return {
        result: response.Result, 
        messages: response.Messages
    };
  } else {
    throw new Error(response.Errors);
  }
}