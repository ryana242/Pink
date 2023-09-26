const express = require("express");
const {
  Users,
  Complain,
  ComplainAgainst,
  ComplainReviewer,
  Evidence,
  ComplainDescription,
  Comment,
} = require("../models");
const router = express.Router();
const path = require("path");
const uuid = require("uuid");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

//Used to change the status of complain (Open to Close)
router.post("/change-status", async (req, res) => {
  await Complain.update(
    {
      status: Complain.getAttributes().status.values[1],
    },
    {
      where: {
        complainUNID: req.body.complainUNID,
      },
    }
  );

  res.json({
    data: "Status Updated",
    error: "",
  });
});

//Used to add comment to a complain
router.post("/add-comment", async (req, res) => {
  const temp = await Comment.findOne({
    attributes: ["commentNumber"],
    where: {
      complainUNID: req.body.complainUNID,
      commentNumber: {
        [Op.eq]: Sequelize.literal(
          `(Select max(commentNumber) from comments where complainUNID='` +
            req.body.complainUNID +
            `')`
        ),
      },
    },
  });

  let commentNumber = 0;

  if (temp != null) {
    commentNumber = temp.dataValues.commentNumber + 1;
  }

  await Comment.create({
    ComplainUNID: req.body.complainUNID,
    comment: req.body.comment,
    commentNumber: commentNumber,
  });

  res.json({
    data: "Comment added Successfully",
    error: "",
  });
});

router.get("/total-edits", async (req, res) => {
  const temp = await Complain.findOne({
    attributes: ["edits"],
    where: {
      complainUNID: req.query.complainUNID,
    },
  });

  res.json({
    data: temp,
    error: "",
  });
});
router.get("/complain-history", async (req, res) => {
  const result = await Complain.findAll({
    include: [
      {
        model: ComplainAgainst,
        where: { 
          editHistory: req.query.id,
        },
        include: [
          {
            model: Users,
            attributes: ["fullName", "userUNID"], 
          },
        ],
      },
      {
        model: ComplainDescription,
        attributes: ["complainDescription"],
        where: {
          editHistory: req.query.id,
        },
      },
      {
        model: Evidence,
        attributes: ["evidence"],
        where: {
          editHistory: req.query.id,
        },
      },
    ],
    where: {
      complainUNID: req.query.complainUNID,
    },
  });

  res.json({
    data: result,
    error: "",
  });
});

//Get entire details of a user along with complain lodged, complains to review
router.get("/user-details", async (req, res) => {
  const result = await Users.findOne({
    attributes: ["fullName", "email", "nsuId", "userType", "actorType"],
    where: {
      userUNID: req.query.userUNID,
    },
    include: [
      {
        model: Complain,
        attributes: [
          "complainUNID",
          "complainTitle",
          "status",
          "complainerUNID",
        ],
        include: [
          {
            model: Comment,
            attributes: ["comment", "commentNumber"],
            required: false,
            separate: true,
            order: [["commentNumber", "DESC"]],
            limit: 1,
          },
          {
            model: ComplainReviewer,
            attributes: ["ComplainReviewerUserUNID"],
            include: [
              {
                model: Users,
                attributes: ["fullName"],
              },
            ],
          },
        ],
      },
      {
        model: ComplainReviewer,
        attributes: ["complainUNID"],
        required: false,
        where: {
          currentReviewer:
            ComplainReviewer.getAttributes().currentReviewer.values[0],
        },
        include: [
          {
            model: Complain,
            attributes: ["complainTitle", "status"],
            include: [
              {
                model: Users,
                attributes: ["fullName", "userUNID"],
              },
            ],
          },
        ],
      },
    ],
  });
  return res.json({
    data: result,
    error: "",
  });
});

//Used to edit a complain
router.post("/edit-complain", async (req, res) => {
  const complainAgainstUserUNID = JSON.parse(req.body.complainAgainstUserUNID);
  const temp = await Complain.findOne({
    attributes: ["edits"],
    where: {
      complainUNID: req.body.complainUNID,
    },
  });

  const editNumber = temp.dataValues.edits + 1;

  await Complain.update(
    {
      edits: editNumber,
    },
    {
      where: {
        complainUNID: req.body.complainUNID,
      },
    }
  );

  for (let i = 0; i < complainAgainstUserUNID.length; i++) {
    await ComplainAgainst.create({
      ComplainUNID: req.body.complainUNID,
      ComplainAgainstUserUNID: complainAgainstUserUNID[i],
      editHistory: editNumber,
    });
  }

  if (req.files != null) {
    const files = req.files.file;

    async function move(image, idx) {
      let uploadPath;
      uploadPath = path.join(__dirname, "..");
      uploadPath +=
        "/uploads/Evidence/" +
        req.body.complainUNID +
        "-" +
        (idx + req.body.oldEvidenceCount) +
        "." +
        image.name.split(".").pop();
      try {
        image.mv(uploadPath);
      } catch (e) {
        return res.send({
          success: false,
          message: "upload error",
        });
      }
      await Evidence.create({
        ComplainUNID: req.body.complainUNID,
        evidence:
          req.body.complainUNID +
          "-" +
          (idx + req.body.oldEvidenceCount) +
          "." +
          image.name.split(".").pop(),
        editHistory: editNumber,
      });
    }

    Array.isArray(files)
      ? files.forEach((file, idx) => move(file, idx))
      : move(files, 0);
  }

  await ComplainDescription.create({
    ComplainUNID: req.body.complainUNID,
    complainDescription: req.body.complainDescription,
    editHistory: editNumber,
  });

  res.json({
    data: "Edited Successfully",
    error: "",
  });
});

//Used to change reviewer
router.post("/change-reviewer", async (req, res) => {
  await ComplainReviewer.update(
    {
      currentReviewer:
        ComplainReviewer.getAttributes().currentReviewer.values[1],
    },
    {
      where: {
        complainUNID: req.body.complainUNID,
      },
    }
  );

  //creating new reviewer
  const result = await ComplainReviewer.create({
    currentReviewer: ComplainReviewer.getAttributes().currentReviewer.values[0],
    ComplainReviewerUserUNID: req.body.complainReviewerUserUNID,
    ComplainUNID: req.body.complainUNID,
  });

  res.json({
    data: result,
    error: "",
  });
});

//Used to get the latest version of the complain
router.get("/complain-latest-details", async (req, res) => {
  const temp = await Complain.findOne({
    attributes: ["edits"],
    where: {
      complainUNID: req.query.complainUNID,
    },
  });

  if (temp == null) {
    return res.json({
      data: "",
      error: "Invalid Complain UNID",
    });
  }

  const result = await Complain.findOne({
    include: [
      {
        model: ComplainAgainst,
        where: {
          editHistory: temp.dataValues.edits,
        },
        include: [
          {
            model: Users,
            attributes: ["fullName", "userUNID", "uniqueDetail"],
          },
        ],
      },
      {
        model: ComplainDescription,
        attributes: ["complainDescription"],
        where: {
          editHistory: temp.dataValues.edits,
        },
      },
      {
        model: Evidence,
        attributes: ["evidence"],
      },
      {
        model: Users,
        attributes: ["fullName", "nsuId", "email", "userType"],
      },
      {
        model: ComplainReviewer,
        where: {
          currentReviewer: "Yes",
        },
        include: [
          {
            model: Users,
            attributes: ["fullName", "userUNID", "uniqueDetail"],
          },
        ],
      },
      {
        model: Comment,
        attributes: ["comment", "commentNumber"],
      },
    ],
    where: {
      complainUNID: req.query.complainUNID,
    },
  });

  res.json({
    data: result,
    error: "",
  });
});

router.get("/all", async (req, res) => {
  const result = await Users.findAll({
    attributes: ["uniqueDetail", "userUNID"],
    where: {
      uniqueDetail: {
        [Op.substring]: req.query.query,
      },
      active: 1,
    },
    limit: 10,
  });
  return res.json({
    data: result,
    error: "",
  });
});

//Get a list of all the reviewers
router.get("/reviewers", async (req, res) => {
  const result = await Users.findAll({
    attributes: ["uniqueDetail", "userUNID"],
    where: {
      [Op.and]: [
        {
          uniqueDetail: {
            [Op.substring]: req.query.query,
          },
        },
        {
          actorType: "Reviewer",
        },
        {
          active: 1,
        },
        {
          userUNID: {
            [Op.notLike]: req.query.userUNID,
          },
        },
      ],
    },
    limit: 10,
  });
  return res.json({
    data: result,
    error: "",
  });
});

//Get a list of all users someone can complain against
router.get("/complain-against", async (req, res) => {
  const result = await Users.findAll({
    attributes: ["uniqueDetail", "userUNID"],
    where: {
      [Op.and]: [
        {
          uniqueDetail: {
            [Op.substring]: req.query.query,
          },
        },
        {
          active: 1,
        },
        {
          userUNID: {
            [Op.notLike]: req.query.userUNID,
          },
        },
      ],
    },
    limit: 10,
  });
  return res.json({
    data: result,
    error: "",
  });
});

//Used to lodge complain
router.post("/lodge-complaint", async (req, res) => {
  const complainUNID = uuid.v4();
  console.log(req.body.complainAgainstUserUNID);
  const complainAgainstUserUNID = JSON.parse(req.body.complainAgainstUserUNID);
  await Complain.create({
    complainUNID: complainUNID,
    complainTitle: req.body.complainTitle,
    ComplainerUNID: req.body.complainerUNID,
  });
  for (let i = 0; i < complainAgainstUserUNID.length; i++) {
    await ComplainAgainst.create({
      ComplainUNID: complainUNID,
      ComplainAgainstUserUNID: complainAgainstUserUNID[i],
    });
  }
  const files = req.files.file;

  async function move(image, idx) {
    let uploadPath;
    uploadPath = path.join(__dirname, "..");
    uploadPath +=
      "/uploads/Evidence/" +
      complainUNID +
      "-" +
      idx +
      "." +
      image.name.split(".").pop();
    try {
      image.mv(uploadPath);
    } catch (e) {
      return res.send({
        success: false,
        message: "upload error",
      });
    }
    await Evidence.create({
      ComplainUNID: complainUNID,
      evidence: complainUNID + "-" + idx + "." + image.name.split(".").pop(),
    });
  }

  Array.isArray(files)
    ? files.forEach((file, idx) => move(file, idx))
    : move(files, 0);

  await ComplainReviewer.create({
    ComplainUNID: complainUNID,
    ComplainReviewerUserUNID: req.body.complainReviewerUserUNID,
    currentReviewer: ComplainReviewer.getAttributes().currentReviewer.values[0],
  });

  await ComplainDescription.create({
    ComplainUNID: complainUNID,
    complainDescription: req.body.complainDescription,
  });

  res.json({
    data: "Succesfully lodged a complaint",
    error: "",
  });
});

router.post("/lodge-complaint-trial", async (req, res) => {
  const complainUNID = uuid.v4();
  await Complain.create({
    complainUNID: complainUNID,
    complainTitle: req.body.complainTitle,
  });

  const files = req.files.file;

  async function move(image, idx) {
    let uploadPath;
    uploadPath = path.join(__dirname, "..");
    uploadPath +=
      "/uploads/Evidence/" +
      complainUNID +
      "-" +
      idx +
      "." +
      image.name.split(".").pop();
    try {
      image.mv(uploadPath);
    } catch (e) {
      return res.send({
        success: false,
        message: "upload error",
      });
    }
    await Evidence.create({
      ComplainUNID: complainUNID,
      evidence: complainUNID + "-" + idx + "." + image.name.split(".").pop(),
    });
  }

  Array.isArray(files)
    ? files.forEach((file, idx) => move(file, idx))
    : move(files, 0);

  res.json({
    data: "Succesfully lodged a complaint",
    error: "",
  });
});

module.exports = router;
