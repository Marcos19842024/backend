import "dotenv/config"
import express from "express"
import cors from "cors"
import routes from "./infrastructure/router"
import path from "path";

const port = process.env.PORT || 3001
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false, limit: '50mb' }))
app.use(express.static(path.join(__dirname, './frontend/build/')))
app.use(express.static(path.join(__dirname, './storage/qrcode')))
app.use(express.static(path.join(__dirname, './storage/media')))

app.use(`/`,routes)

app.listen(port, () => console.log(`Ready...${port}`))