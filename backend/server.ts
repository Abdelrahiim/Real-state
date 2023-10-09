import express from "express"
import morgan from "morgan"
import {connectMongo} from "./services/mongo.ts";
import UserRouter from "./routes/Users/user.router.ts";
import helmet from "helmet";
import cors from "./middlewares/cors.middleware.ts";

import cookieParser from "cookie-parser"
import ListingRouter from "./routes/listing/listing.router.ts";


const PORT = process.env.PORT || 8000
const app = express()



app.use(helmet())
app.use(cors());
app.use(express.json())
app.use(cookieParser())
app.use(morgan("combined"))


app.use("/api/user", UserRouter)
app.use("/api/listing",ListingRouter)


await connectMongo()

app.listen(PORT, () => {
  console.log(`Development Server Started At PORT http://localhost:${PORT}`)
})
export default app


