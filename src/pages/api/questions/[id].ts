import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    const questionId = Number(id);
    
    if (req.method === 'GET') {
        const question = await prisma.question.findUnique({
            where: {id: questionId}
        }) 

        if (!question) {
            return res.status(404).json({message: 'Question not found!'});
        }

        return res.status(200).json({question});
    } else if (req.method === 'PUT') {
        const { title, description } = req.body;

        await prisma.question.update({
            where: {id: questionId},
            data: { title, description }
        })

        return res.status(204).end();
        
    } else if (req.method === 'DELETE') {
        await prisma.question.delete({
            where: {id: questionId}
        })

        return res.status(204).end();
    }
}