import { Router } from "express";
import getAllMessages from "../controllers/messag3e/getAll";

const router = Router();

router.get("/:conversationId", getAllMessages);

export default router;
