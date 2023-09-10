import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../utils/prisma";
const secret = process.env.JWT_SECRET;

const deleteConversation = async (req: Request, res: Response) => {
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

    const conversationExists = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
      },
    });

    if (!conversationExists) {
      return res
        .status(200)
        .json({ success: true, data: null, message: "No conversation exists" });
    }
    // const conversationExists = await prisma.conversation.findFirst({
    //   where: {
    //     OR: [
    //       {
    //         memberOneId: user?.userId,
    //       },
    //       {
    //         memberTwoId: user?.userId,
    //       },
    //     ],
    //   },
    // });

    // if (!conversationExists) {
    //   return res
    //     .status(200)
    //     .json({ success: true, data: null, message: "No conversation exists" });
    // }
    const conversation = await prisma.conversation.delete({
      where: {
        id: conversationId,
        AND: {
          OR: [{ memberOneId: user?.userId }, { memberTwoId: user?.userId }],
        },
      },
    });

    res.status(200).json({ success: true, data: conversation });
  } catch (e) {
    res.status(200).json({ success: false, message: "Error while deleting" });
  }
};

export default deleteConversation;
