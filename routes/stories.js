const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middlewares/auth");
const { findByIdAndUpdate } = require("../models/Story");
const Story = require("../models/Story");

//@route get /get stories
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

//post/stories

router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

//stories get
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

//get single story
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      return res.render("error/404");
    }

    res.render("stories/show", {
      story,
    });
  } catch (err) {
    console.error(err);
    res.render("error/505");
  }
});

//stories edit
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({ _id: req.params.id }).lean();
  if (!story) {
    return res.render("error/404");
  }
  if (story.user != req.user.id) {
    res.redirect("/stories");
  } else {
    res.render("stories/edit", {
      story,
    });
  }
});

//@route get /update stories
router.put("/:id", ensureAuth, async (req, res) => {
  let story = await Story.findById(req.params.id).lean();
  if (!story) {
    return res.render("error/404");
  }
  console.log(story.user.toString() === story.user.toString());
  if (story.user.toString() === story.user.toString()) {
    story = await Story.findByIdAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.redirect("/dashboard");
  } else {
    res.redirect("/stories");
  }
});

//delet stories
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/505");
  }
});

module.exports = router;
