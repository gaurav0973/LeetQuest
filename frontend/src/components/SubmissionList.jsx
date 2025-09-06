import React from 'react';
import { CheckCircle2, XCircle, Clock, MemoryStick as Memory, Calendar } from 'lucide-react';

const SubmissionResults = ({ submission }) => {
  const memoryArr = JSON.parse(submission.memory || '[]');
  const timeArr = JSON.parse(submission.time || '[]');

  const avgMemory = memoryArr
    .map(m => parseFloat(m))
    .reduce((a, b) => a + b, 0) / memoryArr.length;

  const avgTime = timeArr
    .map(t => parseFloat(t))
    .reduce((a, b) => a + b, 0) / timeArr.length;

  const passedTests = submission.testCases.filter(tc => tc.passed).length;
  const totalTests = submission.testCases.length;
  const successRate = (passedTests / totalTests) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-[#f8f4f3] border border-[#b48c8e] shadow-md">
          <div className="card-body p-4">
            <h3 className="card-title text-sm text-[#3b2e2e]">Status</h3>
            <div className={`text-lg font-bold ${
              submission.status === 'Accepted' ? 'text-green-600' : 'text-red-600'
            }`}>
              {submission.status}
            </div>
          </div>
        </div>

        <div className="card bg-[#f8f4f3] border border-[#b48c8e] shadow-md">
          <div className="card-body p-4">
            <h3 className="card-title text-sm text-[#3b2e2e]">Success Rate</h3>
            <div className="text-lg font-bold text-[#5e4444]">
              {successRate.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="card bg-[#f8f4f3] border border-[#b48c8e] shadow-md">
          <div className="card-body p-4">
            <h3 className="card-title text-sm text-[#3b2e2e] flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg. Runtime
            </h3>
            <div className="text-lg font-bold text-[#5e4444]">
              {avgTime.toFixed(3)} s
            </div>
          </div>
        </div>

        <div className="card bg-[#f8f4f3] border border-[#b48c8e] shadow-md">
          <div className="card-body p-4">
            <h3 className="card-title text-sm text-[#3b2e2e] flex items-center gap-2">
              <Memory className="w-4 h-4" />
              Avg. Memory
            </h3>
            <div className="text-lg font-bold text-[#5e4444]">
              {avgMemory.toFixed(0)} KB
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-[#fffafa] border border-[#b48c8e] shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4 text-[#3b2e2e]">Test Cases Results</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="text-[#5e4444]">Status</th>
                  <th className="text-[#5e4444]">Expected Output</th>
                  <th className="text-[#5e4444]">Your Output</th>
                  <th className="text-[#5e4444]">Memory</th>
                  <th className="text-[#5e4444]">Time</th>
                </tr>
              </thead>
              <tbody>
                {submission.testCases.map((testCase) => (
                  <tr key={testCase.id}>
                    <td>
                      {testCase.passed ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="w-5 h-5" />
                          Passed
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle className="w-5 h-5" />
                          Failed
                        </div>
                      )}
                    </td>
                    <td className="font-mono text-[#3b2e2e]">{testCase.expected}</td>
                    <td className="font-mono text-[#3b2e2e]">{testCase.stdout || 'null'}</td>
                    <td className="text-[#3b2e2e]">{testCase.memory}</td>
                    <td className="text-[#3b2e2e]">{testCase.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-sm text-[#5e4444] flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Submitted on: {new Date(submission.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default SubmissionResults;
