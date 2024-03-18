import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getPostComments,
  likeComment,
} from "../controllers/comment.controler.js";

const router = express.Router();

router.post(`/create`, verifyToken, createComment);
router.get(`/get-post-comments/:postId`, getPostComments);
router.put(`/like-comment/:commentId`, verifyToken, likeComment);

export default router;
