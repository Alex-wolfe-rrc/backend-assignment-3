
import { EventModel } from "../models/eventModel";
import { createDocument } from "../repositories/firestoreRepository";

const COLLECTION_NAME: string = "events";

type CreateEventInput = Pick<
    EventModel,
    | "name"
    | "date"
    | "capacity"
    | "registrationCount"
    | "status"
    | "category"
>;

export const createEvent = async (
    eventData: CreateEventInput
): Promise<EventModel> => {
    try {
        const timestamp: string = new Date().toISOString();

        const newEvent: Omit<EventModel, "id"> = {
            ...eventData,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        const id: string = await createDocument<EventModel>(
            COLLECTION_NAME,
            newEvent
        );

        return {
            id,
            ...newEvent,
        };
    } catch (error: unknown) {
        throw new Error("Failed to create event", {
            cause: error,
        });
    }
};
