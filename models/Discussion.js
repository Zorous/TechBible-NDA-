const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
  {
    Title: { type: String, required: true },
    ParentId: { type: String, required: false },
    UserId: { type: String, required: true },
    Description: { type: String, required: true },
    Category: { type: String, required: false },
    LikedBy: { type: Array, required: false },
  },
  { timestamps: true }
);

const Discussion = mongoose.model(
  "Discussion",
  discussionSchema,
  "Discussions"
);

module.exports = Discussion;
