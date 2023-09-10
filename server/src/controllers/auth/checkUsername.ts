import { Request, Response } from "express";

import prisma from "../../utils/prisma";

const checkUsername = async (req: Request, res: Response) => {
  const { username }: { username: string } = req.body;
  try {
    const userNameExists = await prisma.user.findFirst({
      where: { userName: username },
      select: { userName: true, name: true, userId: true },
    });

    res.status(200).json({
      success: true,
      data: {
        userNameExists: !!userNameExists,
        name: userNameExists?.name,
        userId: userNameExists?.userId,
      },
    });
  } catch (e: any) {
    // throw new Error(e);
    return res.status(500).json({ success: false });
  }
};

export default checkUsername;
