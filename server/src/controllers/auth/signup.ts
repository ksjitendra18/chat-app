import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { customAlphabet } from "nanoid";
import * as z from "zod";
import prisma from "../../utils/prisma";

const formData = z.object({
  userName: z
    .string()
    .min(3, {
      message: "Username should be more than 3 characters",
    })
    .max(50, {
      message: "Username should not be more than 50 characters",
    }),
  name: z
    .string()
    .min(3, {
      message: "Name should be more than 3 characters",
    })
    .max(50, {
      message: "Name should not be more than 50 characters",
    }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password should be 8 or more than 8 characters",
  }),
});

const signupUser = async (req: Request, res: Response) => {
  console.log("hit");
  const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    15
  );

  const {
    username,
    name,
    email,
    password,
  }: { name: string; email: string; password: string; username: string } =
    await req.body;

  console.log("username", username, req.headers["content-type"], req.body);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const parsedFormData = formData.parse({
    userName: username,
    name,
    email,
    password,
  });

  console.log("parsed", parsedFormData);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(parsedFormData.password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      userId: nanoid(),
      ...parsedFormData,
      password: hashedPassword,
    },

    select: {
      userId: true,
      email: true,
    },
  });

  res.status(201).json({ success: true, data: user });
};

export default signupUser;
