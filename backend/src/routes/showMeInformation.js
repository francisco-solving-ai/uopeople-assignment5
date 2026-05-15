const express = require("express");
const { ShowMeInformation, User } = require("../models");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const information = await ShowMeInformation.findAll({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json(information);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const information = await ShowMeInformation.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!information) {
      return res.status(404).json({ message: "ShowMe information not found." });
    }

    return res.json(information);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
