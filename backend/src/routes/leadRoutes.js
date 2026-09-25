import express from "express";
import { getAllLeads, createLead } from "../controllers/leadController.js";
import { createLeadSchema } from "../validators/leadValidator.js";
import { validateRequestMiddleware } from "../middleware/validateRequestMiddleware.js";


const router = express.Router();

router.get("/", getAllLeads);

router.post("/", validateRequestMiddleware(createLeadSchema), createLead);

export default router;