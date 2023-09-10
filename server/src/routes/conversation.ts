import { Router } from "express";
import createConversation from "../controllers/conversation/create";
import allConversations from "../controllers/conversation/allConversations";
import getConversation from "../controllers/conversation/getConversation";
import deleteConversation from "../controllers/conversation/delete";

const router = Router();

router.post("/create", createConversation);
router.get("/all", allConversations);
router.get("/:conversationId", getConversation);
router.delete("/:conversationId", deleteConversation);

export default router;
