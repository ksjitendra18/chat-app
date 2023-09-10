import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../utils/prisma";
const secret = process.env.JWT_SECRET;

const getConversation = async (req: Request, res: Response) => {
  const token = req.header("auth-token");
  const { conversationId } = req.params;
  try {
    if (token === "undefined" || token === null) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    const decoded: any = jwt.verify(token!, secret!);

    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
      select: { userId: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Not such user" });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        memberOne: {
          select: {
            name: true,
            userName: true,
            userId: true,
          },
        },
        memberTwo: {
          select: {
            name: true,
            userName: true,
            userId: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(200).json({ success: true, data: [] });
    }

    if (
      conversation.memberOneId === user.userId ||
      conversation.memberTwoId === user.userId
    ) {
      return res.status(200).json({ success: true, data: conversation });
    }

    return res.status(401).json({ message: "Unauthorized" });
  } catch (e: any) {
    throw new Error(e);
  }
};

export default getConversation;
