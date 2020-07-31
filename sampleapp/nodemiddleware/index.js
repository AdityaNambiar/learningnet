const express = require('express');
const config = require('config');
const cors = require('cors');
const bodyparser = require('body-parser');
const app = express();

app.set("jwtPrivateKey",12345);
if(!app.get("jwtPrivateKey")){ // Previously config.get
    console.error("FATAL error: Jwt key not defined...");
    process.exit(1);
  }
app.use(bodyparser.json()) 
app.use(cors());

// Route imports:

app.use('/addStudent', require('./routes/addStudent'));
app.use('/deleteStudent', require('./routes/deleteStudent'));
app.use('/getStudent', require('./routes/getStudent'));
app.use('/updateStudent', require('./routes/updateStudent'));

app.listen(5000,()=>{
    console.log("Listening on 5000...");
})