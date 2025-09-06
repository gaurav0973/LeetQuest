import React, { useEffect, useState } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { useAuthStore } from "../store/useAuthStore";
import { Loader, Filter, Search, TagIcon } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
  const { authUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#fffafa]">
        <Loader className="size-10 animate-spin text-[#b48c8e]" />
      </div>
    );
  }

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      difficultyFilter === "" || problem.difficulty === difficultyFilter;

    const isSolved = problem.solvedBy?.some(
      (user) => user.userId === authUser?.id
    );

    const matchesStatus =
      statusFilter === ""
        ? true
        : statusFilter === "solved"
        ? isSolved
        : !isSolved;

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col py-6 w-full bg-[#fffafa] text-[#3b2e2e]">
      <div className="w-full mb-6">
        <h1 className="text-2xl font-bold mb-2">Problem Set</h1>
        <p className="text-[#5e4444]">
          Enhance your coding skills by solving algorithmic challenges and
          preparing for technical interviews.
        </p>
      </div>

      <div className="w-full bg-[#f8f4f3] border border-[#b48c8e] rounded-lg p-4 mb-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-[#a58d8f]" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 text-sm bg-white text-[#3b2e2e] border border-[#b48c8e] rounded-md focus:ring-1 focus:ring-[#b48c8e] outline-none"
              placeholder="Search problems by title or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-[#b48c8e] text-[#3b2e2e] py-2 pl-10 pr-8 rounded-md focus:outline-none focus:ring-1 focus:ring-[#b48c8e] text-sm"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3">
                <Filter className="w-4 h-4 text-[#a58d8f]" />
              </div>
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-white border border-[#b48c8e] text-[#3b2e2e] py-2 pl-10 pr-8 rounded-md focus:outline-none focus:ring-1 focus:ring-[#b48c8e] text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3">
                <TagIcon className="w-4 h-4 text-[#a58d8f]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredProblems.length > 0 ? (
        <div className="w-full">
          <ProblemTable problems={filteredProblems} />
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-16 border border-dashed border-[#b48c8e] rounded-lg">
          <div className="text-[#a58d8f] text-center">
            <p className="text-lg font-medium mb-2">No problems found</p>
            <p className="text-sm">
              Try adjusting your filters or search terms
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
