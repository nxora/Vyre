 import  mongoose  from "mongoose"
 
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
        console.log("Mongo connected to:", mongoose.connection.name);
        console.log("Connected to DB");
        
    } catch (err) {
        console.error("Connection Failed", err);
        
    }
}

mongoose.connect(mongoUrI).then(() => console.log("MongoDB connected")).catch((err) => console.log("MongoDB Error", err))
