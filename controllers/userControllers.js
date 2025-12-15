const {QueryTypes, where} = require('sequelize');
const db = require('../models/index');
const User = db.user;
const Contact = db.contact;
const Education = db.education;

const postUsers = async(req,res)=>{
    
    try {
    const postData = req.body;
    let data; 
    if(postData.length>1){
     data = await User.bulkCreate(postData);
    }else{
     data = await User.create(postData);
    }
    res.status(200).json(data)
    
    } catch (err) {
        console.log('err>>>>>',err);
        
    }
}


const getUsers = async(req,res)=>{
    const data = await User.findAll({});
    res.status(200).json(data)
}

const getUser = async(req,res)=>{
    const data = await User.findOne({
        where:{
            id:req.params.id
        }
    });
    res.status(200).json(data)
}

const deleteAllUser = async(req,res)=>{
    const data = await User.truncate()
    res.status(200).json(data)
}

const deleteUser = async(req,res)=>{
    const data = await User.destroy({
        where:{
            id:req.params.id
        }
    });
    res.status(200).json(data)
}

const updateUser = async(req,res)=>{
    const patchData = req.body;
    const data = await User.update(patchData,{
        where:{
            id:req.params.id
        }
    });
    res.status(200).json(data)
}

const usersRawQuery = async(req,res)=>{
    const data = await db.sequelize.query('SELECT * FROM users WHERE city = ? OR lastName = ? ',
            {
              replacements: ['Indore','Gupta, Indian'],
              model: User,
              type: QueryTypes.SELECT,
            }
    );

    res.status(200).json(data)

}

const oneToOneUser = async(req,res)=>{

//   const data = await User.create({firstName:"Mohit",lastName:"Sharma"})
//     if(data && data.id){
//      await Contact.create({permanent_address:"Up",current_address:"Bhopal",
//          UserId:data.id })
//      }
 
    const data = await User.findAll({
                include:Contact
    });
 
    res.status(200).json({data})
}


const manyToManyUser = async(req,res)=>{

    // const data = await User.create({firstName:"Mohit",lastName:"Sharma"})
    // if(data && data.id){
    //  await Contact.create({permanent_address:"Up",current_address:"Jabalpur"})
    // }


    const data = await Contact.findAll({
                attributes:['permanent_address','current_address'],
                include:[{
                    model:User,
                    attributes:['firstName','lastName']
                }]
    });


    //     const data = await User.findAll({
    //             attributes:['firstName','lastName'],
    //             include:[{
    //                 model:Contact,
    //                 attributes:['permanent_address','current_address']
    //             }]
    // });

    res.status(200).json({data})
}


const paranoidUser = async(req,res)=>{
//    const data = await User.create({firstName:"Rohit",lastName:"Verma"})
    // const data = await User.destroy({where:{
    //     id:1
    // }});
    const data = await User.restore({where:{id:1}});
   res.status(200).json({data})
}

 const lazyLoadingUser = async(req,res)=>{
//    const data = await User.create({firstName:"Anamika",lastName:"Verma"})
//     if(data && data.id){
//      await Contact.create({permanent_address:"Bihar",current_address:"Indore",
//          UserId:data.id })
//      }
 
    const data = await User.findOne({
                where:{id:2}
     });
    
    const contactData = await data.getContacts(); 
 
    res.status(200).json({data,contactData})
 }


 const eagerLoadingUser = async(req,res)=>{
//    const data = await User.create({firstName:"Anamika",lastName:"Verma"})
//     if(data && data.id){
//      await Contact.create({permanent_address:"Bihar",current_address:"Indore",
//          UserId:data.id })
//      }
 
    const data = await User.findAll({
                include:{
                    model:Contact,
                    include:{
                        model:Education
                    }
                }
        // include:[{
                //     model:Contact,
                //     required:false,
                //     right:true
                // },
                // {
                //     model:Education
                // }]
     });
    

 
    res.status(200).json({data})
 }


module.exports = {
    postUsers,
    getUsers,
    getUser,
    deleteAllUser,
    deleteUser,
    updateUser,
    usersRawQuery,
    oneToOneUser,
    manyToManyUser,
    paranoidUser,
    lazyLoadingUser,
    eagerLoadingUser,
}