const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  reportUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postTitle: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("report", reportSchema);
