import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { db } from "../libs/db.js"

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

        // console.log('Result Send By Judge0-------------')
        // console.log(results);


        // 5. analyse test case result
        let allPassed = true;
        const detailedResults = results.map((result, i) => {
            const stdout = result.stdout?.trim()
            const expected_output = expected_outputs[i]?.trim()
            const passed = stdout === expected_output

            // console.log(`TestCase ${i+1}`);
            // console.log(`Input : ${stdin[i]}`);
            // console.log(`Expected Output : ${expected_output}`);
            // console.log(`Matched TestCase : ${passed}`);
            // console.log("\n\n");

            if (!passed) allPassed = false;
            return {
                testCase: i + 1,
                passed,
                stdout,
                expected: expected_output,
                stderr: result.stderr || null,
                compile_output: result.compile_output || null,
                status: result.status.description,
                memory: result.memory ? `${result.memory} KB` : undefined,
                time: result.time ? `${result.time} s` : undefined,
              };
        })
        
        // console.log("Detailed Result--------------");
        // console.log(detailedResults);


        // 6. store submission summary 
        const submission = await db.submission.create({
            data: {
              userId,
              problemId,
              sourceCode: source_code,
              language: getLanguageName(language_id),
              stdin: stdin.join("\n"),
              stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
              stderr: detailedResults.some((r) => r.stderr)
                ? JSON.stringify(detailedResults.map((r) => r.stderr))
                : null,
              compileOutput: detailedResults.some((r) => r.compile_output)
                ? JSON.stringify(detailedResults.map((r) => r.compile_output))
                : null,
              status: allPassed ? "Accepted" : "Wrong Answer",
              memory: detailedResults.some((r) => r.memory)
                ? JSON.stringify(detailedResults.map((r) => r.memory))
                : null,
              time: detailedResults.some((r) => r.time)
                ? JSON.stringify(detailedResults.map((r) => r.time))
                : null,
            },
          });

        // console.log("Submissions ------");
        // console.log(submission);
        
        


        //7. If all passsed => mark problem is solved for current user
        if (allPassed) {
            await db.problemSolved.upsert({
              where: {
                userId_problemId: {
                  userId,
                  problemId,
                },
              },
              update: {},
              create: {
                userId,
                problemId,
              },
            });
        }

        // console.log("Reaced till allPassed--------")
        

        // 8. save individual test case result using detailedResults
        const testCaseResults = detailedResults.map((result) => ({
            submissionId: submission.id,
            testCase: result.testCase,
            passed: result.passed,
            stdout: result.stdout,
            expectedOutput: result.expected,
            stderr: result.stderr,
            compileOutput: result.compile_output,
            status: result.status,
            memory: result.memory,
            time: result.time,
        }));

        console.log("Reached till Test Case Result--------");
        
      
        await db.testCaseResult.createMany({
            data : testCaseResults,
        });

        console.log("Reached till Test Case Result Submissions--------");
        
        const submissionWithTestCase = await db.submission.findUnique({
            where: {
              id: submission.id,
            },
            include: {
              testCases: true,
            },
        });




        return res.status(200).json(new ApiResponse(200, "Code Executed! Successfully!", submissionWithTestCase));

        
    } catch (error) {
        console.log("Error while Submitting the code : ", error.message)
        return res.status(500)
                    .json(new ApiError(500, "Error while submitting the code"))
        
    }
});



        