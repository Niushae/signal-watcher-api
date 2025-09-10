import { Request, Response } from 'express';
import { processEventWithAI } from '../services/aiAdapter.js';
import { prisma } from '../lib/db.js';

export const simulateAndCreateEvent = async (req: Request, res: Response) => {
    try {
        const DUMMY_EVENT_TEXT = "Un nuevo dominio fraudulento 'secure-bank-login.net' fue registrado, simulando ser la marca 'Banco Global'.";

        const aiResult = await processEventWithAI(DUMMY_EVENT_TEXT);

        const newEvent = await prisma.event.create({
            data: {
                text: DUMMY_EVENT_TEXT,
                summary: aiResult.summary,
                severity: aiResult.severity,
                suggestedAction: aiResult.suggestedAction,
            }
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Failed to create event due to an internal error." });
    }
};

export const getEvents = async (req: Request, res: Response) => {
    try {
        const sortedEvents = await prisma.event.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        res.status(200).json(sortedEvents);
    } catch(error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Failed to fetch event due to an internal error." });
    }

};