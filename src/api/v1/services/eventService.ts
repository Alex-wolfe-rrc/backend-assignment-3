
import { EventModel } from "../models/eventModel";
import {
    createDocument,
    getDocuments,
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
