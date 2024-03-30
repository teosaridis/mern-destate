import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createMyLink, getMyLinks } from "../controllers/mylinks.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createMyLink);
router.get("/getlinks", getMyLinks);

// router.delete("/deletepost/:postId/:userId", verifyToken, deletePost);
// router.put("/updatepost/:postId/:userId", verifyToken, updatePost);

export default router;
