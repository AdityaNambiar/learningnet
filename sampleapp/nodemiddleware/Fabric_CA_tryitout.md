# Working with Fabric CA (`fabric-ca-client`)
## Key Concepts
### Attributes 
- These are key-value pairs which you can assign to users and also to their Enrollment Certs (ECerts) once they enroll. 
- There is a table of `hf.` attributes which are used for authorizing user for specific activities (provided you are sticking to using Fabric CA as the CA component for your network, since this is pluggable as they say. I haven't tested it myself)
    - Click on this [link](https://hyperledger-fabric-ca.readthedocs.io/en/latest/users-guide.html#registering-a-new-identity) to take a look at the official attributes - scroll down a bit until you see a table which shows the attributes.
### Affiliations
- These are plain categories (_sort of_) which you use to _affiliate_ users with, for instance, different departments of an organization. 
- This is useful when we want to categorize users based on their affiliation with an organization.
 - In Hyperledger Composer, we used to use 'Participant Type' to designate a user by their role in the company. E.g. Network Admin, Director, Technician etc.
     In Fabric SDK, we'll be, by standards, assigning this **categorization of user** in their identity  as affiliation.
 - Affiliations are NOT key-value pairs (unlike Attributes). So make sure to use them for their purpose itself i.e. to "affiliate" somebody to something.
 Example of Affiliation for a college student:-
 - In a sentence: John is a student in the IT department of MyCollege
 - By affiliation syntax, we create the affiliation of John with TCET in the below manner and then add `MyCollege.IT.Student` to John's Identity: 
    ```
    affiliation: MyCollege
      affiliation: MyCollege.IT
        affiliation: MyCollege.IT.Student
    ```
### Default nature
- Fabric CA must have an admin user enrolled before we start interacting as a client with the server.
- Fabric CA Server must be configured with at least one pre-registered bootstrap identity to enable you to register and enroll other identities. The `-b` option specifies the name and password for a bootstrap identity - [link #2](#links)
    - This bootstrap identity is given as a startup command if you observe `ca-org1` service in `docker-compose.yaml` file in the repository.
    - This makes sure that our admin user is **pre-registered** in the server and the task of enrollment (which comes after registration of any user) is left to us or the Fabric SDK.

#### Trying out Fabric CA as a client via CLI:
- Before we start working as a client, we need a server booted up.  
Before we run the Fabric CA Server, we need to disable TLS communication (it has been quite difficult for me to figure out TLS setup while enrolling user so I suggested this as a easier approach since we wish to learn more about `fabric-ca-client` CLI than TLS file management)  
The best way I'd suggest is to run `docker-compose up ca-org1` so as to boot up a simple Fabric CA Server as a docker container.  
Follow the below steps in the same sequence to create an affiliation (two-level depth), a user and add some attributes to them:  
1. We will be entering server's bash shell via `docker exec -it ca.org1.example.com bash`.
2. To enroll our admin user, enter:
    `fabric-ca-client enroll -u http://admin:adminpw@localhost:7054`
    - Note that the `-u` option is used for providing a URL. `admin:adminpw` is nothing but `username:password` given to the `fabric-ca-server` as a bootstrap identity in `docker-compose.yaml` file.
    - Also note that, we need not enter admin's username and password as given above. It could be any username and not just `admin` and any password. 
3. To add an affiliation, enter:
    `fabric-ca-client affiliation add MyCollege`
      then,
    `fabric-ca-client affiliation add MyCollege.IT`
    - For a list of commands for CRUD operations, check `fabric-ca-client affiliation --help`
    - Remember you _must_ add affiliation depth wise. Example, directly trying to add `MyCollege.IT` won't work if there is no affiliation named `MyCollege`.
4. To add a new user, we must register the user followed by enrollment (equivalent to 'login'). Enter:
    `fabric-ca-client register --id.name aditya --id.secret aditya12345 --id.affiliation MyCollege.IT --id.attrs '"hf.Registrar.Roles=peer,client"'`
      then, for enrollment:
    `fabric-ca-client enroll -u http://aditya:aditya12345@localhost:7054`
    - As you may have observed, I have added an attribute of `hf.Registrar.Roles` where I specify which roles user `aditya` can manage as a registrar.
5. (Just for observation) To check list of identities registered & enrolled, use:
    `fabric-ca-client identity list`
    - For list of commands for CRUD operations on identities, check `fabric-ca-client identity --help`
6. To add an attribute to the user, enter:
    `fabric-ca-client identity modify aditya --secret aditya12345 --attrs 'pType=FourthYear'`
    - To add this attribute to user's enrollment certificate, add the suffix `:ecert` at the end of the attribute like:
    `fabric-ca-client identity modify aditya --secret aditya12345 --attrs 'pType=FourthYear:ecert'`
7. Perform Step 5 again if you wish to observe the changes in the user identity. 

## Difference between registration and enrollment terminology
- Registration is just the plain registration (creation) of user in the Fabric CA Server SQL database (I came to know about the type of DB by looking at the errors it can generate, refer [link #2](#links))
- Enrollment is what we call "login", in the terminology of Fabric CA. If you enroll an admin user, any commands you run after admin's enrollment, it would mean that those commands are ran by the admin user. Similarly if you register and enroll a new user, then you'd be running any subsequent commands under the identity of this new user.
 
## <a name="links"></a>Important links:
1. [Understanding user registration and enrollment in Hyperledger Fabric](https://sidshome.wordpress.com/2018/12/28/understanding-user-registration-and-enrollment-in-hyperledger-fabric/)
    - _Consist of examples and detailed explanation with examples on how to work with user registration & enrollment_
2. [Fabric CA User Guide](https://hyperledger-fabric-ca.readthedocs.io/en/latest/users-guide.html#)
