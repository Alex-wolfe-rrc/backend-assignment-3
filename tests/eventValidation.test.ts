
import { ValidationResult } from "joi";
import { createEventSchema } from "../src/api/v1/validations/eventValidation";

describe("Event creation validation", () => {
    const futureDate: string = "2099-12-25T09:00:00.000Z";

    it("should accept a valid event and apply defaults", () => {
        // Arrange
        const event: {
            name: string;
            date: string;
            capacity: number;
        } = {
            name: "Tech Conference",
            date: futureDate,
            capacity: 100,
        };

        // Act
        const result: ValidationResult = createEventSchema.validate(event);

        // Assert
        expect(result.error).toBeUndefined();
        expect(result.value.registrationCount).toBe(0);
        expect(result.value.status).toBe("active");
        expect(result.value.category).toBe("general");
    });

    it("should reject an event name shorter than 3 characters", () => {
        // Arrange
        const event: {
            name: string;
            date: string;
            capacity: number;
        } = {
            name: "AB",
            date: futureDate,
            capacity: 100,
        };

        // Act
        const result: ValidationResult = createEventSchema.validate(event);

        // Assert
        expect(result.error?.details[0].message).toBe(
            '"name" length must be at least 3 characters long'
        );
    });

    it("should reject capacity below the minimum", () => {
        // Arrange
        const event: {
            name: string;
            date: string;
            capacity: number;
        } = {
            name: "Small Event",
            date: futureDate,
            capacity: 4,
        };

        // Act
        const result: ValidationResult = createEventSchema.validate(event);

        // Assert
        expect(result.error?.details[0].message).toBe(
            '"capacity" must be greater than or equal to 5'
        );
    });

    it("should reject registrations exceeding capacity", () => {
        // Arrange
        const event: {
            name: string;
            date: string;
            capacity: number;
            registrationCount: number;
        } = {
            name: "Overbooked Event",
            date: futureDate,
            capacity: 100,
            registrationCount: 150,
        };

        // Act
        const result: ValidationResult = createEventSchema.validate(event);

        // Assert
        expect(result.error?.details[0].message).toBe(
            '"registrationCount" must be less than or equal to ref:capacity'
        );
    });
});
