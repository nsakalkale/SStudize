import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Teacher =
  mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
export default Teacher;
