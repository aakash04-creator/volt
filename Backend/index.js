require('dotenv').config();
const express=require('express'), cors=require('cors');
const auth=require('./routes/auth'), api=require('./routes/api');
const app=express(); app.use(cors());app.use(express.json({limit:'2mb'}));
app.get('/api/health',(req,res)=>res.json({status:'ok',app:'VoltTrack Lite'}));app.use('/api/auth',auth);app.use('/api',api);
app.use((err,req,res,next)=>{console.error(err);res.status(err.status||500).json({error:err.message||'Server error'})});
const port=process.env.PORT||3000;app.listen(port,()=>console.log(`VoltTrack API running at http://localhost:${port}`));