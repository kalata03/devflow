import { Prisma } from "@prisma/client";

export type AnswerWithUser = Prisma.AnswerGetPayload<{
  include: { user: true }
}>;

export type QuestionWithAnswers = Prisma.QuestionGetPayload<{
  include: { answers: true }
}>;

export type QuestionWithCountAndUser = Prisma.QuestionGetPayload<{
  include: { _count: { select: { answers: true } }, user: true };
}>;