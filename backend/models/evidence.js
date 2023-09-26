// Model to store Evidence info

module.exports = (sequelize, DataTypes) => {
  const Evidence = sequelize.define("Evidence", {
    evidence: DataTypes.STRING, //To store Evidence name

    //To keep track of edit as it can be editted
    editHistory: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  Evidence.associate = (models) => {
    
    //One to many association with Complain model (Each Evidence belongs to a Complain)
    Evidence.belongsTo(models.Complain, {
      foreignKey: {
        name: "ComplainUNID",
      },
    });
  };
  return Evidence;
};
