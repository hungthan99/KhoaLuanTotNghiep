const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema({
  idProvince: {
    type: String,
    require: true,
  },
  idDistrict: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("District", districtSchema);
