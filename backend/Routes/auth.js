const express = require("express");
const { Users } = require("../models");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const uuid = require("uuid");
const { Op } = require("sequelize");
const { UserVerification } = require("../models");
const { mailSender } = require("../utilities/utilities");
const path = require("path");
const { GoogleVerification } = require("../models");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "992655217366-qiu0iegl7kmotoovl1630k6283o0jsuk.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);


//Used for google signins
router.post("/google-accounts", async (req, res) => {
  try {
    let googleID;
    const ticket = await client.verifyIdToken({
      idToken: req.body.googleID,
      audience: CLIENT_ID,
    });
    payload = ticket.getPayload();
    console.log(payload);
    googleID = payload.sub;
    const result = await GoogleVerification.findOne({
      include: [
        {
          model: Users,
          attributes: ["active"],
        },
      ],
      where: {
        googleID: googleID,
      },
    });
    if (result == null) {
      return res.json({
        data: "",
        error: "Account Not Registered using Google Signup",
      });
    } else {
      if (result.User.active == false){
        console.log(result.User.active)
        return res.json({
          data: "",
          error: "Account not found. Please contact admin.",
        });
      }
      return res.json({
        data: result,
        error: "",
      });
    }
  } catch (error) {
    return res.json({
      data: "",
      error: error,
    });
  }
});


//Used for google signups
router.post("/register/google", async (req, res) => {
  try {
    let googleID;
    const ticket = await client.verifyIdToken({
      idToken: req.body.googleID,
      audience: CLIENT_ID,
    });
    payload = ticket.getPayload();
    console.log(payload);
    googleID = payload.sub;
    const result = await Users.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email }, 
          { nsuId: req.body.nsuId}],
      },
    });
    if (result === null) {
      let actorType;
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
      console.log("Upload path:" + uploadPath);
      file.mv(uploadPath, function (err) {
        if (err) {
          return res.json({
            data: "",
            error: "File Upload Error",
          });
        }
      });
      const UNID = uuid.v4();
      
      const user = await Users.create({
        userUNID: UNID,
        fullName: req.body.fullName,
        nsuId: req.body.nsuId,
        email: req.body.email,
        uniqueDetail: req.body.fullName + " [" + req.body.nsuId + "]",
        actorType: actorType,
        accountType: Users.getAttributes().accountType.values[0],
        userType: req.body.userType,
        isVerified: true,
        nsuIdPhoto: req.body.nsuId + "." + file.name.split(".").pop(),
      });
      res.json({
        data: user,
        error: "",
      });
      await GoogleVerification.create({
        googleID: googleID,
        UserUNID: UNID,
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
  } catch (error) {
    res.json({
      data: "",
      error: "error",
    });
  }
});


//Used for default registration
router.post("/register", async (req, res) => {
  const result = await Users.findOne({
    where: {
      [Op.or]: [
        { email: req.body.email }, 
        { nsuId: req.body.nsuId}],
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
      password: password,
      userType: req.body.userType,
      nsuIdPhoto: req.body.nsuId + "." + file.name.split(".").pop(), //Just the name of the file which is there in our backend server
    });
    const verificationToken = uuid.v4();
    await UserVerification.create({
      verificationToken: verificationToken,
      expiryDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), //24 hours valid to verify email
      UserUNID: UNID,
    });

    let subject = "Verify Email";
    let text =
      "Please visit the following link to verify your email:\n" +
      "http://localhost:3000/email-verified/" +
      verificationToken;
    mailSender(req.body.email, subject, text);
  } else {
    if (result.active == false){
      return res.json({
        data: "",
        error: "Account not found. Please contact admin.",
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

//Used for verifying email
router.get("/verify-email/:verificationToken", async (req, res) => {
  const result = await UserVerification.findOne({
    where: {
      verificationToken: req.params.verificationToken,
    },
  });
  if (result) {
    if (result.expiryDate > new Date()) {
      await Users.update(
        {
          isVerified: true,
        },
        {
          where: {
            userUNID: result.UserUNID,
          },
        }
      );
      await UserVerification.update(
        {
          isVerified: true,
        },
        {
          where: {
            verificationToken: req.params.verificationToken,
          },
        }
      );
      res.json({
        data: "Email Verified",
        error: "",
      });
    } else {
      res.json({
        data: "",
        error: "Verify Time passed",
      });
    }
  }
});

//Used for verifying if the verification token in the params is valid or not.
router.post("/verify-verification-token", async (req, res) => {
  const result = await UserVerification.findOne({
    where: {
      verificationToken: req.body.verificationToken,
    },
  });
  if(result == null){
    return res.json({
      data: "",
      error: "Invalid verification token",
    });
  } else {
    if (result.expiryDate < new Date()) {
      return res.json({
        data: "",
        error: "Link expired.",
      });
    } else {
      return res.json({
        data: "Email verified successfully!",
        error: "",
      });
    }
  }
});

//Used for login
router.post("/login", async (req, res) => {
  const result = await Users.findOne({
    where: { email: req.body.email },
  });

  if (result === null) {
    return res.json({
      data: "",
      error: "Account Not Registered.",
    });
  } else {
    if (result.password == null) {
      return res.json({
        data: "",
        error: "Please login using google SignIn",
      });
    } else if (await bcrypt.compare(req.body.password, result.password)) {
      if (result.isVerified) {
        if (result.active) {
          //Can send user UNID only too
          return res.json({
            data: result,
            error: "",
          });
        } else {
          return res.json({
            data: "",
            error: "Account not found. Please contact admin.",
          });
        }
      } else {
        return res.json({
          data: "",
          error: "Please verify your email.",
        });
      }
    } else {
      return res.json({
        data: "",
        error: "Credentials don't match",
      });
    }
  }
});

//Used for checking whether email sent for forget password is correct or not
router.post("/forget-password", async (req, res) => {
  const result = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (result == null) {
    return res.json({
      data: "",
      error: "Account not found!",
    });
  } else {
    if (result.password == null) {
      return res.json({
        data: "",
        error: "Please login using google SignIn",
      });
    } else if (result.isVerified) {
      let subject = "Account recovery";
      let text =
        "Please visit the following link:\n" +
        "http://localhost:3000/reset-password/" +
        result.userUNID;
      mailSender(result.email, subject, text);
      return res.json({
        data: "Please check your email to recover your account.",
        error: "",
      });
    } else {
      return res.json({
        data: "",
        error: "Email not verified. Please verify first.",
      });
    }
  }
});

//used to verify UNID (used for checking the userUNID stored in localstorage)
router.post("/verify-unid", async (req, res) => {
  const result = await Users.findOne({
    where: {
      userUNID: req.body.UNID,
    },
  });
  if (result == null) {
    return res.json({
      data: "",
      error: "Access denied.",
    });
  } else {
    return res.json({
      data: "Accessible",
      error: "",
    });
  }
});

//used for verifying default logged in user
router.post("/verify-default-user", async (req, res) => {
  const result = await Users.findOne({
    where: {
      userUNID: req.body.UNID,
      accountType: Users.getAttributes().accountType.values[1],
    },
  });
  if (result == null) {
    return res.json({
      data: "",
      error: "Access denied.",
    });
  } else {
    return res.json({
      data: "Accessible",
      error: "",
    });
  }
});

//used to update password
router.post("/password-update", async (req, res) => {
  const result = await Users.findOne({
    where: {
      userUNID: req.body.UNID,
    },
  });

  //Wont usually Happen because unid is always found in reset password
  if (result == null) {
    return res.json({
      data: "",
      error: "Unknown Error. Contact Admin.",
    });
  } else {
    const password = await bcrypt.hash(req.body.password, saltRounds);
    await Users.update(
      {
        password: password,
      },
      {
        where: {
          userUNID: req.body.UNID,
        },
      }
    );

    return res.json({
      data: "Password Successfully Updated",
      error: "",
    });
  }
});

router.post("/resend-link", async (req, res) => {
  const result = await UserVerification.findOne({
    where: {
      verificationToken: req.body.verificationToken
    }
  });
  if (result == null) {
    return res.json({
      data: "",
      error: "Invalid verfication token.",
    });
  } 
  verificationToken = uuid.v4();
    await UserVerification.create({
      verificationToken: verificationToken,
      expiryDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), //24 hours valid to verify email
      UserUNID: result.UserUNID,
    });

    const user = await Users.findOne({
      where: {
        UserUNID: result.UserUNID
      }
    });
    let subject = "Verify Email";
    let text =
      "Please visit the following link to verify your email:\n" +
      "http://localhost:3000/email-verified/" +
      verificationToken;
    mailSender(user.email, subject, text);
});

module.exports = router;

//TODO:
//1. Unique Token for password change
//2. Expiry time for password change
//3. Check primarity of NSU ID
//4. Eye of passwords dissappear        {DONE}
//5. After succesfull register redirect to homepage   {DONE}
//6. Same for login  {DONE}
//7. Add videos to file type    {DONE}
//8. Add ID image while registering   {DONE}
//9. Add ID image to search bar
//10. Options after typing in search bar  {DONE}
//11. Send UNID along with fullname to lodge complain  {DONE}
//12. What all can be updated in lodge complain  {DONE}
//13. Give errors as soon as input is taken
//14. How to know admin is logged in, create a password for admin  {DONE}
//15. Resend mail automatically for verification if unverified account tries to login after 24 hour
//16. link diye editdetails e jaite parbena
//17. Navbar will be different for admin