import { db } from "../libs/db.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

export const createProblem = asyncHandler(async (req, res) => {
  //1. create problems info from req.body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  //2. going to check user role again
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json(new ApiError(403, "Only Admins can create problems"));
  }

  //3. Loop through each reference solution for different language
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json(new ApiError(400, "Invalid Language"));
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-----", result);
        if (result.status.id !== 3) {
          return res.status(400).json(new ApiError(400, "Invalid Solution"));
        }
      }
    }

    const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
      });

    return res.status(201).json(new ApiResponse(201, "Problem created successfully", newProblem));


  } catch (error) {
    console.log("Error while creating problem", error);
    return res
      .status(500)
      .json(new ApiError(500, "Error while creating problem"));
  }
});

export const getAllProblems = asyncHandler(async (req, res) => {});

export const getProblemById = asyncHandler(async (req, res) => {});

export const updateProblem = asyncHandler(async (req, res) => {});

export const deleteProblem = asyncHandler(async (req, res) => {});

export const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {});
