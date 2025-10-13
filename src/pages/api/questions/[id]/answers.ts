import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const questionId = Number(id);

    if (!questionId || isNaN(questionId)) {
        return res.status(400).json({ message: "Invalid question ID" });
    }
    
    if (req.method === 'GET') {
        const answers = await prisma.answer.findMany({
            where: {questionId},
        })

        return res.status(200).json({ answers });
    } else if (req.method === 'POST') {
        const { content } = req.body;

        const newAnswer = await prisma.answer.create({
            data: { content, questionId }
        })

        return res.status(201).json({answer: newAnswer})
    }
}
