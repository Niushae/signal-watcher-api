import { Request, Response } from 'express';
import { events, Event } from '../models/event.js';
import { processEventWithAI } from '../services/aiAdapter.js';
import { v4 as uuidv4 } from 'uuid';

export const simulateAndCreateEvent = async (req: Request, res: Response) => {
    try {
        const DUMMY_EVENT_TEXT = "Un nuevo dominio fraudulento 'secure-bank-login.net' fue registrado, simulando ser la marca 'Banco Global'.";

        const aiResult = await processEventWithAI(DUMMY_EVENT_TEXT);

        const newEvent: Event = {
            id: uuidv4(),
            text: DUMMY_EVENT_TEXT,
            ...aiResult,
            createdAt: new Date()
        };
        
        events.push(newEvent);

        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Failed to create event due to an internal error." });
    }
};

export const getEvents = (req: Request, res: Response) => {
    const sortedEvents = [...events].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    res.status(200).json(sortedEvents);
};