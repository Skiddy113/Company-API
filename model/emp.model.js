const mongoose = require("mongoose");
const EmpSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    desg: {
      type: mongoose.Types.ObjectId,
      ref: "designation",
      required: true,
    },

    dtjoin: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Emp = mongoose.model("employee", EmpSchema);
module.exports = Emp;
