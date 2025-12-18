import mongoose from 'mongoose'


export async function connectDB() {
    try{
        
        await mongoose.connect(process.env.MONGO_URI);

        mongoose.connection.on("error",(err)=>{
            logger.error("MongoDB connection error",err);
        });

        mongoose.connection.on("disconnected",(err)=>{
            logger.error("MongoDB disconnected");
        });

        process.on("SIGINT",async ()=>{
            await mongoose.connection.close();
            logger.info("mongoDB connection closed");
            process.exit(0); 
        })

        console.log("mongodb connected");
    }catch(error){
        console.log(error)
        process.exit(1)   
    }
}