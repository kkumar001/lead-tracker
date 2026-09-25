import express from "express";
import { getAllLeads, createLead, updateLeadStatus } from "../controllers/leadController.js";
import { createLeadSchema, updateStatusSchema } from "../validators/leadValidator.js";
import { validateRequestMiddleware } from "../middleware/validateRequestMiddleware.js";


const router = express.Router();

router.get("/", getAllLeads);

router.post("/", validateRequestMiddleware(createLeadSchema), createLead);

router.put("/:id/status", validateRequestMiddleware(updateStatusSchema), updateLeadStatus);

export default router;