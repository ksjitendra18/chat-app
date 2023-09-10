import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { customAlphabet } from "nanoid";
import * as z from "zod";
import prisma from "../../utils/prisma";
import { userInfo } from "os";

const createConversation = async (req: Request, res: Response) => {
  const { memberOneId, memberTwoUsername } = req.body;

  const memberTwo = await prisma.user.findFirst({
    where: {
      userName: memberTwoUsername,
    },
    select: {
      userId: true,
    },
  });

  if (!memberTwo?.userId) {
    return;
  }

  if (memberOneId === memberTwo.userId) {
    return res.status(200).json({ success: true, self: true, data: null });
  }

  const conversationExists = await prisma.conversation.findFirst({
    where: {
      OR: [
        {
          memberOneId: memberOneId,
          memberTwoId: memberTwo.userId,
        },
        {
          memberOneId: memberTwo.userId,
          memberTwoId: memberOneId,
        },
      ],
    },
  });

  console.log("here", conversationExists);
  if (conversationExists) {
    return res.status(200).json({ success: true, data: conversationExists });
  }
  const conversation = await prisma.conversation.create({
    data: {
      memberOneId: memberOneId,
      memberTwoId: memberTwo.userId,
    },
  });
  res.status(201).json({ success: true, data: conversation });
};

export default createConversation;
