import {connectDB} from "@/lib/mongodb";

export const GET=async()=>{
    await connectDB();
    return new Response("DB connection attempted");
};