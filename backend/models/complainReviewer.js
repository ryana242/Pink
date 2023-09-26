// Model to store Complain Reviewer info

module.exports = (sequelize, DataTypes) => {
  const ComplainReviewer = sequelize.define("ComplainReviewer", {
    //Enum to check if this user is current reviewer
    currentReviewer: {
      type: DataTypes.ENUM("Yes", "No"),
    },
  });

  ComplainReviewer.associate = (models) => {
    //One to many association with Complain model (Each Reviewer belongs to a Complain)
    ComplainReviewer.belongsTo(models.Complain, {
      foreignKey: {
        name: "ComplainUNID",
      },
    });

    //One to many association with User model (Each Reviewer is a User)
    ComplainReviewer.belongsTo(models.Users, {
      foreignKey: {
        name: "ComplainReviewerUserUNID",
      },
    });
  };

  return ComplainReviewer;
};
