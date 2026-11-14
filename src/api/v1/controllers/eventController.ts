
import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { EventModel } from "../models/eventModel";
import * as eventService from "../services/eventService";

type EventInput = Omit<
    EventModel,
    "id" | "createdAt" | "updatedAt"
>;

type EventRequestBody = Omit<EventInput, "date"> & {
    date: Date;
};

type EventParams = {
    id: string;
};

export const createEvent = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const body: EventRequestBody = req.body;

        const event: EventModel = await eventService.createEvent({
            ...body,
            date: body.date.toISOString(),
        });

        res.status(HTTP_STATUS.CREATED).json({
            message: "Event created",
            data: event,
        });
    } catch (error: unknown) {
        console.error(error);

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to create event",
        });
    }
};

export const getAllEvents = async (
    _req: Request,
    res: Response
): Promise<void> => {
    try {
        const events: EventModel[] =
            await eventService.getAllEvents();

        res.status(HTTP_STATUS.OK).json({
            message: "Events retrieved",
            count: events.length,
            data: events,
        });
    } catch (error: unknown) {
        console.error(error);

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to retrieve events",
        });
    }
};

export const getEventById = async (
    req: Request<EventParams>,
    res: Response
): Promise<void> => {
    try {
        const event: EventModel | null =
            await eventService.getEventById(req.params.id);

        if (!event) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Event not found",
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Event retrieved",
            data: event,
        });
    } catch (error: unknown) {
        console.error(error);

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to retrieve event",
        });
    }
};

export const updateEvent = async (
    req: Request<EventParams>,
    res: Response
): Promise<void> => {
    try {
        const body: Partial<EventRequestBody> = req.body;
        const { date, ...fields } = body;

        const eventData: Partial<EventInput> = {
            ...fields,
        };

        if (date !== undefined) {
            eventData.date = date.toISOString();
        }

        const event: EventModel | null =
            await eventService.updateEvent(
                req.params.id,
                eventData
            );

        if (!event) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Event not found",
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Event updated",
            data: event,
        });
    } catch (error: unknown) {
        if (error instanceof eventService.EventValidationError) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: `Validation error: ${error.message}`,
            });
            return;
        }

        console.error(error);

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to update event",
        });
    }
};

export const deleteEvent = async (
    req: Request<EventParams>,
    res: Response
): Promise<void> => {
    try {
        const deleted: boolean =
            await eventService.deleteEvent(req.params.id);

        if (!deleted) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Event not found",
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Event deleted",
        });
    } catch (error: unknown) {
        console.error(error);

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to delete event",
        });
    }
};
