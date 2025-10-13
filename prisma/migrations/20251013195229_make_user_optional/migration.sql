-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_userId_fkey";

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
