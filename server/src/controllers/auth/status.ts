import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../utils/prisma";
const secret = process.env.JWT_SECRET;

const authStatus = async (req: Request, res: Response) => {
  const token = req.header("auth-token");

  try {
    if (token === "undefined" || token === null) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    const decoded: any = jwt.verify(token!, secret!);

    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
      select: { email: true, userId: true, userName: true },
    });

    res.status(200).json({ success: true, data: user });
  } catch (e: any) {
    throw new Error(e);
  }
};

export default authStatus;
