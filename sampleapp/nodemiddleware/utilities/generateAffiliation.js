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

/**
 * Generates affiliation for user as string.
 * Expected params:
 * @param entites Array of CA object, user (who is trying to register) and then affiliation hierarchy. 
 * @example [CA_Object, User, orgA, deptA, deptB]
 */


module.exports = (...entities) => {
  return new Promise( async (resolve, reject) => {
    const ca = entities[0];
    const user = entities[1];
    const affStr = entities.slice(2).join('.'); // Slice to get the affiliation hierarchy elements such as [Org,Dept] and join them by Org.Dept format
    const affiliationService = ca.newAffiliationService();
    const response = await affiliationService.create({
      name: affStr,
      force: true
    }, user);
    // console.log("ServiceResponse: \n", response);
    if (response.success){
      resolve({
          result: response.result, 
          messages: response.messages
      });
    } else {
      reject(new Error(response.errors));
    }
  })
}