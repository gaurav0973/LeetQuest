import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";


export const executeCode = asyncHandler(async(req, res) => {
    try {
        const { source_code, language_id, stdin, expected_outputs, problemId } = req.body
        const userId = req.user.id
        if (!userId) {
            return res.status(400).json(new ApiError(400, "User Not found"));
        }

        //1. validate test cases
        if (!Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length)
            {
            return res.status(400).json(new ApiError(400, "Invalid or Missing test cases"))
            }

        //2. Prepare each test cases for judge0 batch submission
        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input
          }));
        
        //3. Send batch of submissions to judge0
        const submitResponse = await submitBatch(submissions);
        const tokens = submitResponse.map((res)=>res.token);

        // 4. Poll judge0 for results of all submitted test cases
        const results = await pollBatchResults(tokens);

        console.log('Result-------------')
        console.log(results);

        return res.status(200).json(new ApiResponse(200, "Code Executed"))

        
    } catch (error) {
        console.log("Error while Submitting the code : ", error)
        return res.status(500)
                    .json(new ApiError(500, "Error while submitting the code"))
        
    }
});



        