const express = require("express");
const { Users } = require("../models");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const uuid = require("uuid");
const path = require("path");

//admin use this to create an account on behalf of someone
router.post("/create-account", async (req, res) => {
  const result = await Users.findOne({
    where: {
      [Op.or]: [{ email: req.body.email }, { nsuId: req.body.nsuId }],
    },
  });
  if (result === null) {
    res.json({
      data: "Registration Successfull",
      error: "",
    });
    let actorType;
    if (
      !(
        req.body.userType == "Faculty" ||
        req.body.userType == "Admin" ||
        req.body.userType == "Student" ||
        req.body.userType == "RA / TA / Lab Instructor" ||
        req.body.userType == "Helper"
      )
    ) {
      return res.json({
        data: "",
        error: "Please select your designation",
      });
    }

    if (req.body.userType == "Faculty" || req.body.userType == "Admin") {
      actorType = Users.getAttributes().actorType.values[0];
    } else {
      actorType = Users.getAttributes().actorType.values[1];
    }

    let uploadPath;
    const file = req.files.file;
    uploadPath = path.join(__dirname, "..");
    uploadPath +=
      "/uploads/NSU IDs/" + req.body.nsuId + "." + file.name.split(".").pop();
    file.mv(uploadPath, function (err) {
      if (err) {
        return res.json({
          data: "",
          error: "File Upload Error",
        });
      }
    });
    const UNID = uuid.v4();
    const password = await bcrypt.hash(req.body.password, saltRounds);
    await Users.create({
      userUNID: UNID,
      fullName: req.body.fullName,
      nsuId: req.body.nsuId,
      uniqueDetail: req.body.fullName + " [" + req.body.nsuId + "]",
      email: req.body.email,
      actorType: actorType,
      accountType: Users.getAttributes().accountType.values[1],
      isVerified: 1,
      password: password,
      userType: req.body.userType,
      nsuIdPhoto: req.body.nsuId + "." + file.name.split(".").pop(), //Just the name of the file which is there in our backend server
    });
  } else {
    if (result.active == 0) {
      await Users.update(
        {
          active: 1,
        },
        {
          where: {
            userUNID: result.userUNID,
          },
        }
      );
      res.json({
        data: "Account recovered successfully",
        error: "",
      });
    } else if (result.email == req.body.email){
      res.json({
        data: "",
        error: "Email Already Registered",
      });
    } else {
      res.json({
        data: "",
        error: "NSU ID Already Used",
      });
    }
  }
});

//Used to make an account inaccessible by sys admin
router.post("/delete-account", async (req, res) => {
  await Users.update(
    {
      active: 0,
    },
    {
      where: {
        userUNID: req.body.userUNID,
      },
    }
  );
  return res.json({
    data: "Deleted Account Successfully",
    error: "",
  });
});

module.exports = router;
