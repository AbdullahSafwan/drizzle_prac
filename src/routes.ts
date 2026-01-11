import express from "express";

const router = express.Router();

router.get("/api/v1/", (req, res) => {
  res.send("Server is up and running");
});

export default router;
