const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getPosts, createPost, addReply, deletePost } = require("../controllers/forumController");
router.get("/", auth, getPosts);
router.post("/", auth, createPost);
router.post("/:id/reply", auth, addReply);
router.delete("/:id", auth, deletePost);
module.exports = router;
