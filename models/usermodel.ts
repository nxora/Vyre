import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false }, 
    followers: { type: [mongoose.Schema.Types.ObjectId], default: [], ref: "User" },
    following: { type: [mongoose.Schema.Types.ObjectId], default: [], ref: "User" },
    },
  { timestamps: true }
);
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
