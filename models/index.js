const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('employeedb','root','',{
    host:'localhost',
    dialect:'mysql',
    port:3307,
    logging:false
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('unable to connect to the database >>>',error)
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user')(sequelize,DataTypes,Model)
db.contact = require('./contact')(sequelize,DataTypes)
db.education = require('./education')(sequelize,DataTypes)
db.userContacts = require('./userContacts')(sequelize,DataTypes,db.user,db.contact)

db.user.hasMany(db.contact)
db.contact.belongsTo(db.user)

db.contact.hasMany(db.education)
db.education.belongsTo(db.contact)

// db.user.belongsToMany(db.contact,{through:db.userContacts});
// db.contact.belongsToMany(db.user,{through:db.userContacts});


db.sequelize.sync();
// db.sequelize.sync({force:true});
// db.sequelize.drop();


module.exports = db 