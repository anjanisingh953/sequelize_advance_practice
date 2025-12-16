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


  const creatorUser = async(req,res)=>{

   const data = await Contact.create({
        permanent_address:"Himanchal",
        current_address:"Bhopal",
        users:{
            firstName:"Mohit",
            lastName:"Sharma"
        }
   },{
     include:[db.contactUser]
   })
    
 
    // const data = await User.findAll({
    //             include:{
    //                 model:Contact,
    //                 include:{
    //                     model:Education
    //                 }
    //             }
    //     // include:[{
    //             //     model:Contact,
    //             //     required:false,
    //             //     right:true
    //             // },
    //             // {
    //             //     model:Education
    //             // }]
    //  });
    

 
    res.status(200).json({data})
 }


const mnAssociationUser = async(req,res)=>{
    
//    const amidala = await db.customer.create({ username: 'p4dm3', points: 1000 });
//    const queen = await db.profile.create({ name: 'Queen' });
//    await amidala.addProfile(queen, { through: { selfGranted: false } });
//    const result = await db.customer.findOne({
//         where: { username: 'p4dm3' },
//           include: db.profile,
//    });

// const amidala = await db.customer.create(
//   {
//     username: 'p4dm3',
//     points: 1000,
//     profiles: [
//       {
//         name: 'Queen',
//         User_Profile: {
//           selfGranted: true,
//         },
//       },
//     ],
//   },
//   {
//     include: db.profile,
//   },
// );

// const result = await db.customer.findOne({
//   where: { username: 'p4dm3' },
//   include: db.profile,
// });

    const result = await db.customer.findAll({
    include: {
        model: db.grant,
        include: db.profile,
    },
    });

   console.log(result);
    res.status(200).json({data:result})
}

const m2m2mUser = async(req,res)=>{
     await db.player.bulkCreate([
    { username: 's0me0ne' },
    { username: 'empty' },
    { username: 'greenhead' },
    { username: 'not_spock' },
    { username: 'bowl_of_petunias' },
  ]);
  await db.game.bulkCreate([
    { name: 'The Big Clash' },
    { name: 'Winter Showdown' },
    { name: 'Summer Beatdown' },
  ]);
  await db.team.bulkCreate([
    { name: 'The Martians' },
    { name: 'The Earthlings' },
    { name: 'The Plutonians' },
  ]);

    await db.gameTeam.bulkCreate([
    { GameId: 1, TeamId: 1 }, // this GameTeam will get id 1
    { GameId: 1, TeamId: 2 }, // this GameTeam will get id 2
    { GameId: 2, TeamId: 1 }, // this GameTeam will get id 3
    { GameId: 2, TeamId: 3 }, // this GameTeam will get id 4
    { GameId: 3, TeamId: 2 }, // this GameTeam will get id 5
    { GameId: 3, TeamId: 3 }, // this GameTeam will get id 6
  ]);

  await db.playerGameTeam.bulkCreate([
    // In 'Winter Showdown' (i.e. GameTeamIds 3 and 4):
    { PlayerId: 1, GameTeamId: 3 }, // s0me0ne played for The Martians
    { PlayerId: 3, GameTeamId: 3 }, // greenhead played for The Martians
    { PlayerId: 4, GameTeamId: 4 }, // not_spock played for The Plutonians
    { PlayerId: 5, GameTeamId: 4 }, // bowl_of_petunias played for The Plutonians
  ]);

    // Now we can make queries!
  const data = await db.game.findOne({
    where: {
      name: 'Winter Showdown',
    },
    include: {
      model: db.gameTeam,
      include: [
        {
          model: db.player,
          through: { attributes: [] }, // Hide unwanted `PlayerGameTeam` nested object from results
        },
        db.team,
      ],
    },
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
    creatorUser,
    mnAssociationUser,
    m2m2mUser
}