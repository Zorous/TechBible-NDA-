const mongoose = require("mongoose");

const toolCommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    toolId: { type: String, required: true },
    likedBy: { type: Array, required: true },
  },
  { timestamps: true }
);

const ToolsComments = mongoose.model("ToolComment", toolCommentSchema);

module.exports = ToolsComments;
