const mongoose = require("mongoose");

const provinceSchema = new mongoose.Schema({
  idProvince: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Province", provinceSchema);