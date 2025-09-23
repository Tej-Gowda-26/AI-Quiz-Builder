import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  try {
    const { name, email, password } = await req.json();
    await connectDB();

    const existUser = await User.findOne({ email });
    if (existUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashPassword });

    return new Response(JSON.stringify({ message: "User created successfully" }), { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ message: "Error creating user" }), { status: 500 });
  }
};
