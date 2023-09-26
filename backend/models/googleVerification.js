//This is to keep track of all users who registered using google signup

module.exports = (sequelize, DataTypes) => {
  const GoogleVerification = sequelize.define("GoogleVerification", {
    
    //Unique google ID
    googleID: {
      type: DataTypes.STRING,
      primaryKey: true,
    },

    //to check if User is verified
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  GoogleVerification.associate = (models) => {

    //One to One association with User model
    //(Each Google Verification is done for a User)
    GoogleVerification.belongsTo(models.Users, {
      foreignKey: {
        name: "UserUNID",
      },
    });
  };

  return GoogleVerification;
};
