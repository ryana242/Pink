// Model to store Information about Users againt whom complain is lodged

module.exports = (sequelize, DataTypes) => {
  const ComplainAgainst = sequelize.define("ComplainAgainst", {
    //To keep track of the version as it can be editted
    editHistory: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  ComplainAgainst.associate = (models) => {
    //One to many association with Complain model (Each Complain Against belongs to a Complain)
    ComplainAgainst.belongsTo(models.Complain, {
      foreignKey: {
        name: "ComplainUNID",
      },
    });

    //One to many association with User model (Each Complain Against is a User)
    ComplainAgainst.belongsTo(models.Users, {
      foreignKey: {
        name: "ComplainAgainstUserUNID",
      },
    });
  };

  return ComplainAgainst;
};
