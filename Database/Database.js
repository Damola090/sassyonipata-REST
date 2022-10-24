const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/sassyonipata', {
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true
    }).then((con)=> {
        console.log(`Database connection has been established ${con.connection.host}`)
    })
}

module.exports = connectDatabase;