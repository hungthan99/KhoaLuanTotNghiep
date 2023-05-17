const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();

const userRouter = require("./routes/UserRoute");
const postRouter = require("./routes/PostRoute");
const reportRouter = require("./routes/ReportRoute");
const projectRouter = require("./routes/ProjectRoute");
const provinceRouter = require("./routes/ProvinceRoute");
const districtRouter = require("./routes/DistrictRoute");
const wardRouter = require("./routes/WardRoute");
app.use(express.json());

app.use(morgan("common"));

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/report", reportRouter);
app.use("/api/project", projectRouter);
app.use("/api/province", provinceRouter);
app.use("/api/district", districtRouter);
app.use("/api/ward", wardRouter);

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connected to MongoDB!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running!");
});
