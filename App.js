const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
// const fileUpload = require('express-fileupload')

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(cors({origin: true, credentials: true }));

//import all routes 
const auth = require('./Routes/auth');
const product = require('./Routes/product');


//set up Route
app.use('/api/v1', auth);
app.use('/api/v1', product);


module.exports = app


