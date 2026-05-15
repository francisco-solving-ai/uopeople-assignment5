const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");

require("dotenv").config();

const databaseName = process.env.DB_NAME || "showme_backend";
const databaseUser = process.env.DB_USER || "root";
const databasePassword = process.env.DB_PASSWORD || "";
const databaseHost = process.env.DB_HOST || "127.0.0.1";
const databasePort = Number(process.env.DB_PORT) || 3306;

const sequelize = new Sequelize(databaseName, databaseUser, databasePassword, {
  host: databaseHost,
  port: databasePort,
  dialect: "mysql",
  logging: false,
});

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: databaseHost,
    port: databasePort,
    user: databaseUser,
    password: databasePassword,
  });

  await connection.query(
    "CREATE DATABASE IF NOT EXISTS ?? CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    [databaseName]
  );

  await connection.end();
}

module.exports = {
  sequelize,
  ensureDatabaseExists,
};
