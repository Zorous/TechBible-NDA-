const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

//MODELS
const Tools = require("./models/Tool");
const ToolsComments = require("./models/ToolComment");
const Subscribers = require("./models/Subscribers");
const NewsArticle = require("./models/NewsArticle");
const HomePageTool = require("./models/HomePageTool");

//CONNECTING TO DATABASE

const uri =
  "mongodb+srv://techbible:nRgcJ2M8O6DRoznj@techbible.eggj9te.mongodb.net/techbible";

// Define your routes here
app.get("/mongo-tools", async (req, res) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    const tools = await Tools.find();

    // console.log("TOOLS : ",tools);
    res.send(tools); // Send an object containing both variables
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tools data");
  }
});
//HOMETOOLS
app.get("/homePageTools", async (req, res) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const tools = await HomePageTool.find({});
    console.log("Home TOOLS: ", tools);
    res.send(tools);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tools data");
  }
});

//DELETE a Tool
app.delete("/delete-tool/:id", async (req, res) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    const tool = await Tools.deleteOne({ _id: req.params.id });

    res.send(tool); // Send an object containing both variables
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting tool data");
  }
});

// get a specific number of tools
app.get("/mongo-tools/:limit", async (req, res) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const limit = parseInt(req.params.limit);

    const tools = await Tools.find()
      .sort({ likedBy: -1 }) // Sort by the 'likedBy' field in descending order
      .limit(limit);

    res.send(tools);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tools data");
  }
});

// To GET TOOL COMMENTS
app.get("/mongo-toolComments/:toolId", async (req, res) => {
  let { toolId } = req.params;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const toolsComments = await ToolsComments.find({ toolId: toolId });

    res.send(toolsComments);
    console.log("toolsComments :" + toolsComments);
    console.log(typeof toolsComments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tools data");
  }
});

app.post("/like/:id/:uid", async (req, res) => {
  let { id, uid } = req.params;
  try {
    await Tools.findByIdAndUpdate(id, {
      $addToSet: { LikedBy: uid },
    });
  } catch (error) {
    console.log(error);
  }

  console.log("tool has been liked successfully!!!!!");
});

//remove a user from a tool likedBy array
app.post("/unlike/:id/:uid", async (req, res) => {
  let { id, uid } = req.params;
  try {
    const tool = await Tools.findById(id);
    // Remove the uid from the LikedBy array using the filter method
    const updatedLikedBy = tool.LikedBy.filter(
      (likedByUid) => likedByUid !== uid
    );
    // Update the tool document with the updated LikedBy array
    const updatedTool = await Tools.findByIdAndUpdate(id, {
      LikedBy: updatedLikedBy,
    });
    return res.send(updatedTool);
  } catch (error) {
    console.log(error);
  }
  console.log("tool has been unliked succefuly!!!!!");
});

//NEWS START
app.get("/news", async (req, res) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    const news = await NewsArticle.find();
    console.log("news : ", news);
    res.send(news); // Send an object containing both variables
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching news data");
  }
});
//NEWS END

// Add a News Article START
app.post("/addArticle", async (req, res) => {
  try {
    const { Description, Title, URL, ImageURL, Provider } = req.body; // Access request body instead of params
    const newArticle = await NewsArticle.create({
      name: Title,
      description: Description,
      url: URL,
      image: {
        contentUrl: ImageURL,
      },
      provider: [
        {
          name: Provider,
          image: {
            contentUrl:
              "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg",
          },
        },
      ],
      datePublished: new Date(),
    });

    res.status(201).json(newArticle);
    console.log("Article added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding News Article");
  }
});

// Add a News Article END

// Add a Tool Comment
app.post(
  "/addToolComment/:toolId/:userId/:commentText/:parentId",
  async (req, res) => {
    try {
      const { toolId, userId, commentText, parentId } = req.params;
      const newComment = await ToolsComments.create({
        text: commentText,
        userId: userId,
        toolId: toolId,
        parentId: parentId,
      });
      // assuming that `Tools` is the model for the tools collection
      const tool = await Tools.findById(toolId);
      tool.comments.push(newComment._id);
      await tool.save();
      res.status(201).json(newComment);
      console.log("comment added");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding tool comment");
    }
  }
);

// LIKE A TOOL COMMENT
app.post("/likeToolComment/:toolCommentId/:userId", async (req, res) => {
  let { toolCommentId, userId } = req.params;
  try {
    await ToolsComments.findByIdAndUpdate(toolCommentId, {
      $push: { likedBy: userId },
    });
    console.log("Tool comment has been liked successfully!!!!!");
  } catch (error) {
    console.log(error);
  }
});

// UNLIKE A TOOL COMMENT
app.post("/unlikeToolComment/:toolCommentId/:userId", async (req, res) => {
  let { toolCommentId, userId } = req.params;
  try {
    const toolComment = await ToolsComments.findById(toolCommentId);
    // Remove the uid from the LikedBy array using the filter method
    const updatedLikedBy = toolComment.likedBy?.filter(
      (likedByUid) => likedByUid !== userId
    );
    // Update the tool document with the updated LikedBy array
    const updatedToolComment = await ToolsComments.findByIdAndUpdate(
      toolCommentId,
      {
        likedBy: updatedLikedBy,
      }
    );

    console.log("tool Comment has been unliked succefuly!!!!!");
    return res.send(updatedToolComment);
  } catch (error) {
    console.log(error);
  }
});

app.post("", async (req, res) => {
  try {
    const tools = await Tools.find({ Category: { $in: res.interests } })
      .limit(3)
      .toArray();

    console.log("Tools:", tools);
    // Do something with the tools array

    // Close the MongoDB connection when finished
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

//add newsletter subscribers
app.post("/addSubscriber/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const newSubscriber = await Subscribers.create({
      email: email,
    });

    res.status(201).json(newSubscriber);
    console.log("comment added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding tool comment");
  }
});
