
import { EventModel } from "../models/eventModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

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

export const getAllEvents = async (): Promise<EventModel[]> => {
    try {
        const snapshot: FirebaseFirestore.QuerySnapshot =
            await getDocuments(COLLECTION_NAME);

        const events: EventModel[] = snapshot.docs.map(
            (doc: FirebaseFirestore.QueryDocumentSnapshot): EventModel => ({
                ...doc.data(),
                id: doc.id,
            } as EventModel)
        );

        return events;
    } catch (error: unknown) {
        throw new Error("Failed to retrieve events", {
            cause: error,
        });
    }
};


export const getEventById = async (
    id: string
): Promise<EventModel | null> => {
    try {
        const snapshot: FirebaseFirestore.DocumentSnapshot | null =
            await getDocumentById(COLLECTION_NAME, id);

        if (!snapshot) {
            return null;
        }

        return {
            ...snapshot.data(),
            id: snapshot.id,
        } as EventModel;
    } catch (error: unknown) {
        throw new Error("Failed to retrieve event", {
            cause: error,
        });
    }
};


type UpdateEventInput = Partial<
    Pick<
        EventModel,
        | "name"
        | "date"
        | "capacity"
        | "registrationCount"
        | "status"
        | "category"
    >
>;

export const updateEvent = async (
    id: string,
    eventData: UpdateEventInput
): Promise<EventModel | null> => {
    try {
        const existingEvent: EventModel | null =
            await getEventById(id);

        if (!existingEvent) {
            return null;
        }

        const updatedEvent: EventModel = {
            ...existingEvent,
            ...eventData,
            id,
            updatedAt: new Date().toISOString(),
        };

        await updateDocument<EventModel>(
            COLLECTION_NAME,
            id,
            updatedEvent
        );

        return updatedEvent;
    } catch (error: unknown) {
        throw new Error("Failed to update event", {
            cause: error,
        });
    }
};


export const deleteEvent = async (
    id: string
): Promise<boolean> => {
    try {
        const existingEvent: EventModel | null =
            await getEventById(id);

        if (!existingEvent) {
            return false;
        }

        await deleteDocument(COLLECTION_NAME, id);

        return true;
    } catch (error: unknown) {
        throw new Error("Failed to delete event", {
            cause: error,
        });
    }
};
