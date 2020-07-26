/**
 * Generates and returns an Affiliation object for a user trying to register themself.
 * - Affiliations are useful when we want to officially assign a designation to a user. 
 * - In Hyperledger Composer, we used to use 'Participant Type' to designate a user by their role in the company. E.g. Network Admin, Director, Technician etc.
     In Fabric SDK, we'll be, by standards, assigning this **categorization of user** in their identity  as affiliation.
 * - Affiliations are NOT key-value pairs (unlike Attributes). So make sure to use them for their purpose itself i.e. to "affiliate" somebody to something.
 * Example of Affiliation for a college student:-
 * - In a sentence: John is a student in the IT department of TCET
 * - By affiliation syntax: 
        TCET:
 */