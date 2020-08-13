# Invoke chaincode via CLI

To add new student:  
`./myscripts/CLIInvocation/addStudentCLI.sh '{\"id\":65,\"name\":\"John Doe\",\"year\":\"FourthYear\"}' '{\"id\":1,\"totalGrade\":297}'`  

To see all students:  
`./myscripts/CLIInvocation/showStudentCLI.sh`  

To see all grades:  
`./myscripts/CLIInvocation/showGradesCLI.sh`  

To update the new student:  
`./myscripts/CLIInvocation/updateStudentCLI.sh '{\"id\":65,\"name\":\"John Doe\",\"year\":\"FourthYear\",\"grades\":{\"id\":3,\"subA\":100,\"subB\":100,\"subC\":100,\"totalGrade\":300}}'`  

To retrieve that updated student:  
`./myscripts/CLIInvocation/getStudentCLI.sh '{\"id\":65}'`  

To delete the new student:  
`./myscripts/CLIInvocation/deleteStudentCLI.sh '{\"id\":65}'`