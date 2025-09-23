import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
    try {
        const { email, password } = await req.json();

        await connectDB();

        const user = await User.findOne({ email }); //find user
        if (!user) {
            return new Response("user not found", { status: 404 });
        }

        const correctPassword = await bcrypt.compare(password, user.password); //verify password
        if (!correctPassword) {
            return new Response("incorrect password", { status: 401 });
        }

        return new Response("login successful", { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("error logging in", { status: 500 });
    }
}