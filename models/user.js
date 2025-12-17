module.exports = (sequelize,DataTypes)=>{
 const User =   sequelize.define('User',{
        firstName:{
            type: DataTypes.STRING,
            allowNull : false,
            get() {
            const rawValue = this.getDataValue('firstName');
            return rawValue ? rawValue.toUpperCase() : null;
            }

        },
        lastName:{
            type: DataTypes.STRING,
            set(value) {
              this.setDataValue('lastName', value + ', Indian');
            }
        },
        fullName: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.firstName} ${this.lastName}`;
            },
            set(value) {
               throw new Error('Do not try to set the `fullName` value!');
            }
        },
        email:{
            type:DataTypes.STRING,
            unique:true,
            validate:{
                isEmail: {msg:'Please enter a valid email'}
            }
        },
        city:{
            type:DataTypes.STRING,
             validate: {
                isIn: {
                  args: [['Indore', 'Bhopal', 'Jabalpur', 'Delhi']],
                  msg: 'Must be Indore, Bhopal, Jabalpur or Delhi'
               }
             }
        },
        status:{
          type:DataTypes.INTEGER

        }
    },{
        tableName:'users',
        paranoid:true,
        hooks: {
          beforeValidate: (user, options) => {
            user.lastName = 'happy';
          },
          afterValidate: (user, options) => {
            user.status = 1;
          },
        }
    })
  return User;  
}
