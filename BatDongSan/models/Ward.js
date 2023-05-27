const mongoose = require("mongoose");

const wardSchema = new mongoose.Schema({
  idDistrict: {
    type: String,
    require: true,
  },
  idWard: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Ward", wardSchema);
