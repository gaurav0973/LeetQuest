import express from "express"
import { checkAdmin, isLoggedIn } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from "../controllers/problem.controllers.js";

const problemRoutes = express.Router()


problemRoutes.post("/create-problem" , isLoggedIn, checkAdmin , createProblem)
problemRoutes.get("/get-all-problems" , isLoggedIn , getAllProblems);
problemRoutes.get("/get-problem/:id" , isLoggedIn , getProblemById);
problemRoutes.put("/update-problem/:id" , isLoggedIn , checkAdmin , updateProblem)
problemRoutes.delete("/delete-problem/:id" , isLoggedIn , checkAdmin , deleteProblem)
problemRoutes.get("/get-solved-problems" , isLoggedIn , getAllProblemsSolvedByUser);


export default problemRoutes