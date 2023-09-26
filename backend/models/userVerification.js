//This is to keep track of all users who registered using default register page

module.exports = (sequelize, DataTypes) => {
  const UserVerification = sequelize.define("UserVerification", {
    //Unique Token send for verification in mail
    verificationToken: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    //Users can verify email after 24 hours
    expiryDate: {
      type: DataTypes.DATE,
    },
  });

  UserVerification.associate = (models) => {
    //One to Many association with User model
    //(Each user verification belongs to a User)
    UserVerification.belongsTo(models.Users, {
      foreignKey: {
        name: "UserUNID",
      },
    });
  };

  return UserVerification;
};
