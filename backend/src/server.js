require("dotenv").config();

const app = require("./app");
const { sequelize, ensureDatabaseExists } = require("./models");
const { seedDatabase } = require("./seeders/seedData");

const port = Number(process.env.PORT) || 3001;

async function startServer() {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    await sequelize.sync();
    await seedDatabase();

    app.listen(port, () => {
      console.log(`Backend server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start backend server:", error);
    process.exit(1);
  }
}

startServer();
