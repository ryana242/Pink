// Model to store Comment Information

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    comment: DataTypes.STRING, //Comment Info

    //Comment Number in a specific comment
    commentNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  //One to many association with Complain model (Each comment belongs to a complain)
  Comment.associate = (models) => {
    Comment.belongsTo(models.Complain, {
      foreignKey: {
        name: "ComplainUNID",
      },
    });
  };

  return Comment;
};
