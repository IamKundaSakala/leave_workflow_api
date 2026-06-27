require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: "wtWhatjCAAsS6cp",
    database: "leave_workflowDB",
    host: "leave-workflow-db.postgres.database.azure.com",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    username: "postgres",
    password: "DBUser@!!",
    database: "leave_workflowDB",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
