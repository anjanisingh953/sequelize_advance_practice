const express = require('express');
const User = require('./models/user');
require('./models/index');
const userController = require('./controllers/userControllers')

const app = express();
const port  = 8080;
app.use(express.json())


app.post('/test',(req,res)=>{
    console.log(req.body);
    res.json({data:req.body})
    
})

app.get('/test',(req,res)=>{
    res.status(200).json({success:true,message:'success'})
})


//Routes
app.post('/users',userController.postUsers)
app.get('/users',userController.getUsers)
app.get('/users/:id',userController.getUser)
app.delete('/users',userController.deleteAllUser)
app.delete('/users/:id',userController.deleteUser)
app.patch('/users/:id',userController.updateUser)
app.get('/usersrawquery',userController.usersRawQuery)
app.get('/one-to-one',userController.oneToOneUser)
app.get('/many-to-many',userController.manyToManyUser)
app.get('/paranoid',userController.paranoidUser)
app.get('/lazy-loading',userController.lazyLoadingUser)
app.get('/eager-loading',userController.eagerLoadingUser)
app.get('/create-by-association',userController.creatorUser)
app.get('/m-n-association',userController.mnAssociationUser)
app.get('/m2m2m',userController.m2m2mUser)





app.listen(port,()=>{
    console.log(`server is listening at port : ${port}`);    
})