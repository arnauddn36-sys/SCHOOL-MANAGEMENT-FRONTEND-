// routes/statsRoutes.js

import express from "express";

import { getStatistics } from "../controllers/statsController.js";
import { authorize } from "../utils/permissions.js";

const router = express.Router();

// Les statistiques globales sont réservées à l'administrateur.
router.get("/", authorize("admin"), getStatistics);

export default router;
