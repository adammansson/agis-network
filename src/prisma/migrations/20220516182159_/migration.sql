/*
  Warnings:

  - You are about to drop the column `author_id` on the `Page` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[page_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `page_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_user_id_fkey";

-- DropIndex
DROP INDEX "Page_author_id_key";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "author_id",
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "page_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_page_id_key" ON "User"("page_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Page"("page_id") ON DELETE RESTRICT ON UPDATE CASCADE;
