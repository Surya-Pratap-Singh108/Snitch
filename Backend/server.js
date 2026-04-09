import app from './src/app.js'
import connectToDB from './src/config/database.js';


connectToDB();



app.listen(3000,()=>{
    console.log("server is running on port no. 3000");
})