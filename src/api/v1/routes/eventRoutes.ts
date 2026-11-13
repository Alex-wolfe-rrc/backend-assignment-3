
import { Router, Request, Response } from "express";
import { validateRequest } from "../middleware/validate";
import { createEventSchema } from "../validations/eventValidation";

const router: Router = Router();

router.post(
    "/",
    validateRequest({ body: createEventSchema }),
    (_req: Request, res: Response): void => {
        res.status(501).json({
            message: "Create event not implemented yet",
        });
    }
);

export default router;
