const mongoose = require("mongoose");

const connectDB = async() =>{
    
    try{
          const conn = await mongoose.connect("mongooseconnectionurl",
            {
                
                    useNewUrlParser: true,
                    useUnifiedTopology: true,

                  
            }
          );
          

          console.log(`MongoDB connected ${conn.connection.host}`);
    }
    catch (error){
        console.log(error);
        process.exit();
    }
};

module.exports = connectDB;
