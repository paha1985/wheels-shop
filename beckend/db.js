require("dotenv").config();

const Pool = require("pg").Pool;

pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = pool;

// const Pool = require("pg").Pool;
// pool = new Pool({
//   user: "postgres",
//   password: "qwerty123",
//   host: "localhost",
//   port: 5432,
//   database: "wheels_shop",
// });

// module.exports = pool;
