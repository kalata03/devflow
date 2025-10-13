import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const questions = await prisma.question.findMany({
            include: {
              _count: { select: { answers: true }}
            },
            orderBy: { createdAt: 'desc' }
        })

        res.status(200).json({
            questions
        })
    } else if (req.method === 'POST') {
        try {
            const { title, description } = req.body;
      
            const question = await prisma.question.create({
              data: { title, description },
            });
      
            return res.status(201).json({ question });
          } catch (err) {
            console.error("Error creating question:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

    }
}