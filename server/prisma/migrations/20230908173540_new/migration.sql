/*
  Warnings:

  - You are about to drop the column `userUserId` on the `conversation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `conversation` DROP FOREIGN KEY `Conversation_userUserId_fkey`;

-- AlterTable
ALTER TABLE `conversation` DROP COLUMN `userUserId`;
