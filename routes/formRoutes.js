import express from "express";
import { submitForm } from "../controllers/formController.js";

const router = express.Router();

// Public route for form submissions (no authentication required)
router.post('/submit', submitForm);

export default router;
