import express from "express";
import userRoutes from "./routes/userRoutes";
const router = express.Router();

router.get("/api/v1/", (req, res) => {
  res.send("Server is up and running");
});
router.use("/api/v1/user", userRoutes);
export default router;
