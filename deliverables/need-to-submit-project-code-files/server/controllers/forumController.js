const Forum = require("../models/Forum");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Forum.find()
      .populate("userId", "name role")
      .populate("replies.userId", "name role")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (e) { next(e); }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: "Title dan content wajib diisi" });
    const post = await Forum.create({ userId: req.user.id, title, content, category: category || "umum" });
    const populated = await post.populate("userId", "name role");
    res.status(201).json({ success: true, data: populated });
  } catch (e) { next(e); }
};

exports.addReply = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: "Reply tidak boleh kosong" });
    const post = await Forum.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post tidak ditemukan" });
    post.replies.push({ userId: req.user.id, content });
    await post.save();
    const populated = await post.populate("userId", "name role").then(() => post.populate("replies.userId", "name role"));
    const updated = await Forum.findById(req.params.id).populate("userId","name role").populate("replies.userId","name role");
    res.json({ success: true, data: updated });
  } catch (e) { next(e); }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Forum.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post tidak ditemukan" });
    if (post.userId.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Unauthorized" });
    await post.deleteOne();
    res.json({ success: true, message: "Post dihapus" });
  } catch (e) { next(e); }
};
