/*
  Warnings:

  - Made the column `content` on table `Page` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_author_id_fkey";

-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Page"("author_id") ON DELETE RESTRICT ON UPDATE CASCADE;
