import mongoose from "mongoose";


export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection
        connection.on('connected', () => console.log("Mongo connected"))
        connection.on('error', (e) => {
            console.log("Mongo connection error" + e)
            process.exit()
        })

    }
    catch (error) {
        console.log("connect DB failed - " + error)
    }
} 