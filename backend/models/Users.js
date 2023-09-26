//To keep track of all User

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", { 

    // Unique UserID for all user
    userUNID: {
      type: DataTypes.STRING, 
      primaryKey: true,
    },

    fullName: DataTypes.STRING,
    nsuId: DataTypes.STRING,
    email: DataTypes.STRING(320),
    password: DataTypes.STRING,
    uniqueDetail: DataTypes.STRING,
    //Designation
    userType: DataTypes.STRING,
    actorType: {
      type: DataTypes.ENUM("Reviewer", "Non-Reviewer"),
    },
    accountType: {
      type: DataTypes.ENUM("Google", "Default"),
    },
    nsuIdPhoto: DataTypes.STRING,
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  Users.associate = (models) => {
    
    //One to Many association with User verification model
    //(A user can have multiple user verification)
    Users.hasMany(models.UserVerification, {
      foreignKey: {
        name: "UserUNID",
      },
    });

    //One to Many association with Complain model
    //(A user can have multiple Complain)
    Users.hasMany(models.Complain, {
      foreignKey: {
        name: "ComplainerUNID",
      },
    });

    //One to Many association with Complain Reviewer model
    //(A user can have multiple Complain to review)
    Users.hasMany(models.ComplainReviewer, {
      foreignKey: {
        name: "ComplainReviewerUserUNID",
      },
    });
  };

  return Users;
};
