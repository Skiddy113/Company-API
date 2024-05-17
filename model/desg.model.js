const mongoose = require("mongoose");
const DesgSchema = mongoose.Schema(
  {
    desg_name: {
      type: String,
      required: true,
    },
    dept_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Desg = mongoose.model("designation", DesgSchema);
module.exports = Desg;
