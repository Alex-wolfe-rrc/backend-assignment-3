
import * as eventService from "../src/api/v1/services/eventService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { EventModel } from "../src/api/v1/models/eventModel";

jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Event Service", () => {
    const mockEvent: EventModel = {
        id: "test-event-id",
        name: "Tech Conference",
        date: "2099-12-25T09:00:00.000Z",
        capacity: 100,
        registrationCount: 50,
        status: "active",
        category: "conference",
        createdAt: "2026-11-14T09:00:00.000Z",
        updatedAt: "2026-11-14T09:00:00.000Z",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create an event", async () => {
        // Arrange
        const eventData: Omit<
            EventModel,
            "id" | "createdAt" | "updatedAt"
        > = {
            name: mockEvent.name,
            date: mockEvent.date,
            capacity: mockEvent.capacity,
            registrationCount: mockEvent.registrationCount,
            status: mockEvent.status,
            category: mockEvent.category,
        };

        (firestoreRepository.createDocument as jest.Mock)
            .mockResolvedValue(mockEvent.id);

        // Act
        const result: EventModel =
            await eventService.createEvent(eventData);

        // Assert
        expect(firestoreRepository.createDocument)
            .toHaveBeenCalledWith(
                "events",
                expect.objectContaining(eventData)
            );

        expect(result.id).toBe(mockEvent.id);
        expect(result.name).toBe(mockEvent.name);
    });

    it("should retrieve all events", async () => {
        // Arrange
        (firestoreRepository.getDocuments as jest.Mock)
            .mockResolvedValue({
                docs: [
                    {
                        id: mockEvent.id,
                        data: (): EventModel => mockEvent,
                    },
                ],
            });

        // Act
        const result: EventModel[] =
            await eventService.getAllEvents();

        // Assert
        expect(firestoreRepository.getDocuments)
            .toHaveBeenCalledWith("events");

        expect(result).toEqual([mockEvent]);
    });

    it("should retrieve an event by ID", async () => {
        // Arrange
        (firestoreRepository.getDocumentById as jest.Mock)
            .mockResolvedValue({
                id: mockEvent.id,
                data: (): EventModel => mockEvent,
            });

        // Act
        const result: EventModel | null =
            await eventService.getEventById(mockEvent.id);

        // Assert
        expect(firestoreRepository.getDocumentById)
            .toHaveBeenCalledWith("events", mockEvent.id);

        expect(result).toEqual(mockEvent);
    });

    it("should update an existing event", async () => {
        // Arrange
        (firestoreRepository.getDocumentById as jest.Mock)
            .mockResolvedValue({
                id: mockEvent.id,
                data: (): EventModel => mockEvent,
            });

        (firestoreRepository.updateDocument as jest.Mock)
            .mockResolvedValue(undefined);

        // Act
        const result: EventModel | null =
            await eventService.updateEvent(mockEvent.id, {
                capacity: 200,
            });

        // Assert
        expect(firestoreRepository.updateDocument)
            .toHaveBeenCalledWith(
                "events",
                mockEvent.id,
                expect.objectContaining({
                    capacity: 200,
                })
            );

        expect(result?.capacity).toBe(200);
    });

    it("should delete an existing event", async () => {
        // Arrange
        (firestoreRepository.getDocumentById as jest.Mock)
            .mockResolvedValue({
                id: mockEvent.id,
                data: (): EventModel => mockEvent,
            });

        (firestoreRepository.deleteDocument as jest.Mock)
            .mockResolvedValue(undefined);

        // Act
        const result: boolean =
            await eventService.deleteEvent(mockEvent.id);

        // Assert
        expect(firestoreRepository.deleteDocument)
            .toHaveBeenCalledWith("events", mockEvent.id);

        expect(result).toBe(true);
    });
});
