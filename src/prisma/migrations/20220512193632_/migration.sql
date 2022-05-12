/*
  Warnings:

  - The primary key for the `Page` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `post_id` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" DROP CONSTRAINT "Page_pkey",
DROP COLUMN "post_id",
ADD COLUMN     "page_id" SERIAL NOT NULL,
ADD CONSTRAINT "Page_pkey" PRIMARY KEY ("page_id");
