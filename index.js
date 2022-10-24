const app = require('./App.js');
const dotenv = require('dotenv');

const connectDatabase = require('./Database/Database');

dotenv.config({ path: 'Backend/Database/config.env' });

const PORT = process.env.PORT || 3000;

connectDatabase();



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)

})