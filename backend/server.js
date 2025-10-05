import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path"
import { fileURLToPath } from "url";
import resumeRoutes from "./routes/resumeRoutes.js"

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

// Load environment variables at the very top
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

//middleware

app.use('/api/auth',userRoutes)
app.use("/api/resume",resumeRoutes)

app.use(
  '/uploads',
  express.static(path.join(__dirname,'uploads'),{
    setHeaders:(res,_path)=>{
      res.set('Access-Control-Allow-Origin',"http://localhost:5173/")
    }
  })
)
// Routes
app.get("/", (req, res) => res.send("API IS WORKING"));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
