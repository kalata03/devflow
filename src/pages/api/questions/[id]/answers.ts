import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/lib/auth";
import { JwtPayload } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { AnswerWithUser } from "@/types/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const questionId = Number(id);

    if (!questionId || isNaN(questionId)) {
        return res.status(400).json({ message: "Invalid question ID" });
    }
    
    if (req.method === 'GET') {
        const answers: AnswerWithUser[] = await prisma.answer.findMany({
            where: {questionId},
            include: { user: true }
        })

        return res.status(200).json({ answers });
    } else if (req.method === 'POST') {
        const decoded = verifyToken(req);
        if (!decoded || typeof decoded === "string" || !("id" in decoded)) {
        return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = (decoded as JwtPayload & { id: number }).id;

        const { content } = req.body;

        const newAnswer: AnswerWithUser = await prisma.answer.create({
            data: { content, questionId, userId: userId },
            include: {user: true}
        })

        return res.status(201).json({answer: newAnswer})
    }

    return res.status(405).json({ message: "Method not allowed" });
}
