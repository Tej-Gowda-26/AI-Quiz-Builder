import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  userAnswer: { type: String, default: "" },
});

const QuizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  text: { type: String, required: true },
  questions: [QuestionSchema],
  score: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
