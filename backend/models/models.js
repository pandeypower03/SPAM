const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv").config();

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

// Define User model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    PHnumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

// Define Contact model
const Contact = sequelize.define(
  "Contact",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    contact_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "contacts",
    timestamps: false,
  }
);

// Define GlobalContact model
const GlobalContact = sequelize.define(
 "GlobalContact",
 {
   id: {
     type: DataTypes.INTEGER,
     primaryKey: true,
     autoIncrement: true,
   },
   phoneNumber: {
     type: DataTypes.STRING(20),
     allowNull: false,
     unique: true,
   },
   name: {
     type: DataTypes.STRING(100),
     defaultValue: 'Unknown',
   },
   spamLikelihood: {
     type: DataTypes.INTEGER,
     defaultValue: 0,
   },
   totalSpamReports: {
     type: DataTypes.INTEGER,
     defaultValue: 0,
   },
   isRegistered: {
     type: DataTypes.BOOLEAN,
     defaultValue: false,
   },
 },
 {
   tableName: "globalcontacts",
   timestamps: false,
 }
);


// Define Associations
User.hasMany(Contact, { foreignKey: 'user_id', as: 'contacts' });
Contact.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Hide password in JSON responses
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = {
  sequelize,
  User,
  Contact,
  GlobalContact,
};
