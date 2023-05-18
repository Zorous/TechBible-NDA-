const mongoose = require("mongoose");

const NewsArticleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    image: {
      contentUrl: { type: String, required: true }
    },
    provider: [
      {
        name: { type: String, required: true },
        image: {
          contentUrl: { type: String, required: true }
        }
      }
    ],
    datePublished: { type: Date, required: true }
  },
  { timestamps: true }
);

const NewsArticle = mongoose.model("NewsArticle", NewsArticleSchema);

module.exports = NewsArticle;
