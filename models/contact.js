module.exports = (sequelize,DataTypes)=>{
 const Contact = sequelize.define('Contact',{
        permanent_address:{
            type: DataTypes.STRING,
            allowNull : false
        },
        current_address:{
            type: DataTypes.STRING,
        },
        UserId:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
  })
  return Contact;  
}