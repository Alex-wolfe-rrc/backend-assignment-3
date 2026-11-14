
import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import {
    createEventSchema,
    updateEventSchema,
} from "../validations/eventValidation";
import * as eventController from "../controllers/eventController";

const router: Router = express.Router();

router.post(
    "/",
    validateRequest({ body: createEventSchema.required() }),
    eventController.createEvent
);

router.get("/", eventController.getAllEvents);

router.get("/:id", eventController.getEventById);

router.put(
    "/:id",
    validateRequest({ body: updateEventSchema.required() }),
    eventController.updateEvent
);

router.delete("/:id", eventController.deleteEvent);

export default router;
