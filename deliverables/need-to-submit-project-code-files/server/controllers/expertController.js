const Expert = require("../models/Expert");

exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await Expert.find()
      .populate("userId", "name")
      .populate("answeredBy", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: questions });
  } catch (e) { next(e); }
};

exports.askQuestion = async (req, res, next) => {
  try {
    const { question, category } = req.body;
    if (!question) return res.status(400).json({ success: false, message: "Pertanyaan tidak boleh kosong" });
    const q = await Expert.create({ question, category: category || "lainnya", userId: req.user.id });
    res.status(201).json({ success: true, data: q });
  } catch (e) { next(e); }
};

exports.answerQuestion = async (req, res, next) => {
  try {
    const { answer } = req.body;
    if (!answer) return res.status(400).json({ success: false, message: "Jawaban tidak boleh kosong" });
    const q = await Expert.findByIdAndUpdate(
      req.params.id,
      { answer, answeredBy: req.user.id, status: "answered" },
      { new: true }
    ).populate("userId", "name").populate("answeredBy", "name");
    if (!q) return res.status(404).json({ success: false, message: "Pertanyaan tidak ditemukan" });
    res.json({ success: true, data: q });
  } catch (e) { next(e); }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const q = await Expert.findById(req.params.id);
    if (!q) return res.status(404).json({ success: false, message: "Tidak ditemukan" });
    if (q.userId.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Unauthorized" });
    await q.deleteOne();
    res.json({ success: true, message: "Dihapus" });
  } catch (e) { next(e); }
};
