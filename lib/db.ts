import { error } from "console"
import  mongoose  from "mongoose"
import { title } from "process"

const mongoUrI = process.env.MONGO_URI
if (!mongoUrI) {
    throw new Error("Invalid variable")
}
 
let connected = false

export const connectDB = async () => {
    if (connected) return

    try {
        await mongoose.connect(mongoUrI)
        connected = true
        console.log("COnnected to DB");
        
    } catch (err) {
        console.error("Connection Failed", err);
        
    }
}

mongoose.connect(mongoUrI).then(() => console.log("MongoDB connected")).catch((err) => console.log("MongoDB Error", err))
