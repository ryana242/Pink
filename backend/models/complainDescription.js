// Model to store Complain description info

module.exports = (sequelize, DataTypes) => {
  const ComplainDescription = sequelize.define("ComplainDescription", {
    complainDescription: DataTypes.STRING, //description Info

    //To keep track of the version as it can be editted
    editHistory: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  ComplainDescription.associate = (models) => {
    //One to many association with Complain model (Each Description belongs to a Complain)
    ComplainDescription.belongsTo(models.Complain, {
      foreignKey: {
        name: "ComplainUNID",
      },
    });
  };

  return ComplainDescription;
};
