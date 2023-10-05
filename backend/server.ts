import express from "express"
import morgan from "morgan"
import {connectMongo} from "./services/mongo.ts";
import UserRouter from "./routes/Users/user.router.ts";
import helmet from "helmet";


const PORT = process.env.PORT || 8000
const app = express()


// middleware
app.use(helmet())
app.use(express.json())
app.use(morgan("combined"))


app.use("/api/user", UserRouter)


await connectMongo()

app.listen(PORT, () => {
  console.log(`Development Server Started At PORT http://localhost:${PORT}`)
})
export default app


