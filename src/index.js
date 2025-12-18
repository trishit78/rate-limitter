import express from 'express'; 

import dotenv from 'dotenv'

dotenv.config()
const PORT=process.env.PORT;

const app = express();

app.get('/',(req,res)=>{
    console.log('home route hit')
});



app.listen(PORT,()=>{
    console.log(`Port is on ${PORT}`)
})