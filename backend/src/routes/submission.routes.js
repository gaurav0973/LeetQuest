import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getAllSubmission,
  getAllTheSubmissionsForProblem,
  getSubmissionsForProblem,
  getUserSubmissions,
} from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmission);
submissionRoutes.get(
  "/get-submission/:problemId",
  authMiddleware,
  getSubmissionsForProblem
);

submissionRoutes.get(
  "/get-submissions-count/:problemId",
  authMiddleware,
  getAllTheSubmissionsForProblem
);

// Get user submissions with problem info for profile page
submissionRoutes.get("/user", authMiddleware, getUserSubmissions);

export default submissionRoutes;
