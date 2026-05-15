const express = require("express");
const usersRouter = require("./users");
const showMeInformationRouter = require("./showMeInformation");
const { User, ShowMeInformation } = require("../models");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    message: "ShowMe backend is running.",
    endpoints: [
      "/api/users",
      "/api/showme-information",
      "/api/entities",
    ],
  });
});

router.get("/entities", async (_req, res, next) => {
  try {
    const [users, showMeInformation] = await Promise.all([
      User.findAll({ order: [["id", "ASC"]] }),
      ShowMeInformation.findAll({ order: [["id", "ASC"]] }),
    ]);

    res.json({
      users,
      showMeInformation,
    });
  } catch (error) {
    next(error);
  }
});

router.use("/users", usersRouter);
router.use("/showme-information", showMeInformationRouter);

module.exports = router;
