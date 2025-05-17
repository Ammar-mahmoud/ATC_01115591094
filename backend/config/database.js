const mongoose = require("mongoose");

const dbConnection = () => {
    mongoose
  .connect(process.env.DB_URI)
  .then()
  .catch((err) => {
    console.error(`fail: ${err}`);
    process.exit(1);
  });
};

module.exports = dbConnection;