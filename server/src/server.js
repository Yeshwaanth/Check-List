require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const port = process.env.PORT || 5000;

connectDatabase()
  .then(() =>
    app.listen(port, () => console.log(`Server listening on port ${port}`)),
  )
  .catch((error) => {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  });
