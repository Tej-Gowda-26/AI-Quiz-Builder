import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  try {
    const { name, email, password } = await req.json();

    await connectDB();

    // Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) return new Response("User already exists", { status: 400 });

    // Hash password and create user
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashPassword });

    return new Response("User created successfully", { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Error creating user", { status: 500 });
  }
};
