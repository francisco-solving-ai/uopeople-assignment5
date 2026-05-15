const express = require("express");
const { User, ShowMeInformation } = require("../models");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: ShowMeInformation,
          as: "showMeInformation",
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: ShowMeInformation,
          as: "showMeInformation",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
