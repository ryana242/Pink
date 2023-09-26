//Model to store details of a complain

module.exports = (sequelize, DataTypes) => {
  const Complain = sequelize.define("Complain", {
    //Unique Complain UNID
    complainUNID: {
      type: DataTypes.STRING,
      primaryKey: true,
    },

    //Title of a complain (It cant be changed so no extra model required for this)
    complainTitle: DataTypes.STRING,

    //Complain status
    status: {
      type: DataTypes.ENUM("Open", "Close"),
      defaultValue: "Open",
    },

    //Kept to check the number of edits done on a specific comment
    edits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  Complain.associate = (models) => {
    //One to many association with User model (Each Complain belongs to a User)
    Complain.belongsTo(models.Users, {
      foreignKey: {
        name: "ComplainerUNID",
      },
    });

    //One to many association with Complain Reviewer model
    //(Each Complain can have many reviewer as we can change reviewer)
    Complain.hasMany(models.ComplainReviewer, {
      foreignKey: {
        name: "ComplainUNID",
      },
    });

    //One to many association with Complain Description model
    //(Each Complain can have many description as we can edit description)
    Complain.hasMany(models.ComplainDescription, {
      foreignKey: {
        name: "ComplainUNID",
      },
    });

    //One to many association with Complain Against model
    //(Each Complain can have many Users against whom complain is lodged)
    Complain.hasMany(models.ComplainAgainst, {
      foreignKey: {
        name: "ComplainUNID",
      },
    });

    //One to many association with Evidence model
    //(Each Complain can have many many Evidence)
    Complain.hasMany(models.Evidence, {
      foreignKey: {
        name: "ComplainUNID",
      },
    });

    //One to many association with Comment model
    //(Each Complain can have multiple comments)
    Complain.hasMany(models.Comment, {
      foreignKey: {
        name: "ComplainUNID",
      },
    });
  };

  return Complain;
};
