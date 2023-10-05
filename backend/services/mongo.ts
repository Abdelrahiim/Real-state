import mongoose from "mongoose";
import chalk from "chalk";

const Mongo_URL = process.env.MONGO_URL as string

// Connecting To The Database
export async function connectMongo() {
  try {
    await mongoose.connect(Mongo_URL);
    console.log(chalk.greenBright("MongoDB Server Connected Successfully"))

  } catch (e) {
    console.log(chalk.redBright(e))
  }
}


// Disconnect From The Database
export async function disconnectMongo() {
  await mongoose.disconnect()
  console.log(chalk.redBright("MongoDB Server disconnected Successfully"))
}
