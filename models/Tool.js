const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    Icon: { type: String, required: true },
    Category: { type: String, required: true },
    URL: { type: String, required: true },
    Keywords: { type: String, required: false },
    LikedBy: { type: Array, required: false },
    comments: { type: Array, required: false },
  },
  { timestamps: true }
);

const Tools = mongoose.model("Tool", toolSchema);

module.exports = Tools;
