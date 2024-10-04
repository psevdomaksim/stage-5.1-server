const { Sequelize } = require("sequelize");

// module.exports = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   { dialect: "postgres", host: process.env.DB_HOST, port: process.env.DB_PORT }
// );

 module.exports = new Sequelize(
   process.env.POSTGRES_URL
 );

//postgres://postgres:s5lrw33MaDL3ID0@stage5-2.flycast:5432

// const URI = `${process.env.DB_DIALECT}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// const sequelize = new Sequelize(URI);

// Username:    postgres
// Password:    s5lrw33MaDL3ID0
// Hostname:    stage5-2.internal
// Flycast:     fdaa:a:44cd:0:1::3
// Proxy port:  5432
// Postgres port:  5433
