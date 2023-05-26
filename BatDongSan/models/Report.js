const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  reportUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postTitle: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("report", reportSchema);
