const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true,unique: true, },
  },
  { timestamps: true }
);

const Subscribers = mongoose.model("subscriber", subscriberSchema);

module.exports = Subscribers;