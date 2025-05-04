import { db } from "../libs/db.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";


export const getAllSubmission = asyncHandler(async(req,res)  => {
    try {

        const userId = req.user.id
        const submission = await db.submission.findMany({where:{userId}});
        if(!submission){
            return res.status(404)
            .json(new ApiError(404, "No submissions found"));
        }
        
        return res.status(200).json(new ApiResponse(200, "Submissions fetched successfully", submission));
    } 
    catch (error) {
        console.log("Error while fetching all problems", error);
        return res
        .status(500)
        .json(new ApiError(500, "Error while fetching all problems"));
        
    }
})

export const getSubmissionsForProblem = asyncHandler(async(req,res)  => {
    try {

        const userId = req.user.id
        const problemId = req.params.problemId
        const submission = await db.submission.findMany({where:{userId, problemId}})
        if(!submission){
            return res.status(404)
            .json(new ApiError(404, "No submissions found"));
        }
        
        return res.status(200).json(new ApiResponse(200, "Submissions fetched successfully", submission))
        
    } 
    catch (error) {
        console.log("Error while fetching submitted Problems", error);
        return res
        .status(500)
        .json(new ApiError(500, "Error while fetching submitted Problems"));
        
    }
})

export const getAllTheSubmissionsForProblem = asyncHandler(async(req,res)  => {
    try {
        const problemId = req.params.problemId
        const submission = await db.submission.count({where:{problemId}})
        if(!submission){
            return res.status(404)
            .json(new ApiError(404, "No submissions found"));
        }
        return res.status(200).json(new ApiResponse(200, "Submissions fetched successfully", submission))
    } 
    catch (error) {
        console.log("Error while fetching submitted Problems", error);
        return res
        .status(500)
        .json(new ApiError(500, "Error while fetching submitted Problems"));
        
    }
})

