import express from "express"
import chalk from "chalk";

const PORT = process.env.PORT || 8000
const app = express()

app.get("/",(req, res)=>{
    return res.status(200).json({hello:"World"})
})

app.listen(PORT,()=>{
    console.log(`Dev Server Started At PORT ${chalk.greenBright(PORT)} `)
})