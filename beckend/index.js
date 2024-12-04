require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");

const router = require("./routes/index");
const app = express();

app.use(express.static("../frontend/build"));

const errorHandler = require("./middleware/ErrorHandlingMiddleware");

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.status(200).json({
    message: `Server started on PORT ${PORT}`,
  });
});

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
