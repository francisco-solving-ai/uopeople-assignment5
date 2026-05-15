const { sequelize, ensureDatabaseExists } = require("../config/database");
const defineUser = require("./user");
const defineShowMeInformation = require("./showMeInformation");

const User = defineUser(sequelize);
const ShowMeInformation = defineShowMeInformation(sequelize);

User.hasMany(ShowMeInformation, {
  foreignKey: "userId",
  as: "showMeInformation",
});

ShowMeInformation.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = {
  sequelize,
  ensureDatabaseExists,
  User,
  ShowMeInformation,
};
