const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('employeedb','root','',{
    host:'localhost',
    dialect:'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
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
db.DataTypes = DataTypes;

db.user = require('./user')(sequelize,DataTypes,Model)
db.image = require('./image')(sequelize,DataTypes,Model)
db.video = require('./video')(sequelize,DataTypes,Model)
db.comment = require('./comment')(sequelize,DataTypes,Model)
db.tag = require('./tag')(sequelize,DataTypes,Model)
db.tagTaggable = require('./tag_taggable')(sequelize,DataTypes,Model)


db.contact = require('./contact')(sequelize,DataTypes)
db.education = require('./education')(sequelize,DataTypes)
db.customer = require('./customer')(sequelize,DataTypes)
db.profile = require('./profile')(sequelize,DataTypes)
Grant = require('./grant')(sequelize,DataTypes)
db.grant = Grant;
db.userContacts = require('./userContacts')(sequelize,DataTypes,db.user,db.contact)

db.customer.belongsToMany(db.profile, { through: Grant });
db.profile.belongsToMany(db.customer, { through: Grant });


db.customer.hasMany(Grant);
Grant.belongsTo(db.customer);

db.profile.hasMany(Grant);
Grant.belongsTo(db.profile);


db.user.hasMany(db.contact)
db.contactUser =  db.contact.belongsTo(db.user,{foreignKey:'UserId',as:'users'})

db.contact.hasMany(db.education)
db.education.belongsTo(db.contact)

// db.user.belongsToMany(db.contact,{through:db.userContacts});
// db.contact.belongsToMany(db.user,{through:db.userContacts});
db.player = sequelize.define('Player', { username: DataTypes.STRING });
db.team = sequelize.define('Team', { name: DataTypes.STRING });
db.game = sequelize.define('Game', { name: DataTypes.STRING });

// Super Many-to-Many relationship between Game and Team
db.gameTeam = sequelize.define('GameTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});
db.team.belongsToMany(db.game, { through: db.gameTeam });
db.game.belongsToMany(db.team, { through: db.gameTeam });
db.gameTeam.belongsTo(db.game);
db.gameTeam.belongsTo(db.team);
db.game.hasMany(db.gameTeam);
db.team.hasMany(db.gameTeam);



// Super Many-to-Many relationship between Player and GameTeam
db.playerGameTeam = sequelize.define('PlayerGameTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});
db.player.belongsToMany(db.gameTeam, { through: db.playerGameTeam });
db.gameTeam.belongsToMany(db.player, { through: db.playerGameTeam });
db.playerGameTeam.belongsTo(db.player);
db.playerGameTeam.belongsTo(db.gameTeam);
db.player.hasMany(db.playerGameTeam);
db.gameTeam.hasMany(db.playerGameTeam);




//polymorhpic associations
db.image.hasMany(db.comment, {
  foreignKey: 'commentableId',
  constraints: false,
  scope: {
    commentableType: 'image',
  },
});
db.comment.belongsTo(db.image, { foreignKey: 'commentableId', constraints: false });

db.video.hasMany(db.comment, {
  foreignKey: 'commentableId',
  constraints: false,
  scope: {
    commentableType: 'video',
  },
});
db.comment.belongsTo(db.video, { foreignKey: 'commentableId', constraints: false });


db.image.belongsToMany(db.tag, {
  through: {
    model: db.tagTaggable,
    unique: false,
    scope: {
      taggableType: 'image',
    },
  },
  foreignKey: 'taggableId',
  constraints: false,
});


db.tag.belongsToMany(db.image, {
  through: {
    model: db.tagTaggable,
    unique: false,
  },
  foreignKey: 'tagId',
  constraints: false,
});

db.video.belongsToMany(db.tag, {
  through: {
    model: db.tagTaggable,
    unique: false,
    scope: {
      taggableType: 'video',
    },
  },
  foreignKey: 'taggableId',
  constraints: false,
});

db.tag.belongsToMany(db.video, {
  through: {
    model: db.tagTaggable,
    unique: false,
  },
  foreignKey: 'tagId',
  constraints: false,
});

db.sequelize.sync();
// db.sequelize.sync({force:true});
// db.sequelize.drop();


module.exports = db 