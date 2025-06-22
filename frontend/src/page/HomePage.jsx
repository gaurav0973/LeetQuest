import React, { useEffect, useState } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Loader, Filter, Search, TagIcon } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // Filter problems based on search and filters
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "" || problem.difficulty === difficultyFilter;
    // Status filter would need to be implemented with solved problems

    return matchesSearch && matchesDifficulty;
  });
  return (
    <div className="min-h-screen flex flex-col py-6 w-full">
      {/* Subtle background glow */}
      <div className="fixed top-1/4 left-0 w-1/4 h-1/4 bg-white opacity-5 blur-3xl rounded-full"></div>
      <div className="fixed bottom-1/4 right-0 w-1/4 h-1/4 bg-white opacity-5 blur-3xl rounded-full"></div>
      {/* Problems Header */}
      <div className="w-full mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Problem Set</h1>
        <p className="text-gray-400">
          Enhance your coding skills by solving algorithmic challenges and
          preparing for technical interviews
        </p>
      </div>{" "}
      {/* Filter & Search Bar */}
      <div className="w-full bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 text-sm text-white bg-black/40 border border-gray-700 rounded-md focus:ring-1 focus:ring-white focus:outline-none"
              placeholder="Search problems by title or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <select
                className="appearance-none bg-black/40 border border-gray-700 text-white py-2 pl-10 pr-8 rounded-md focus:outline-none focus:ring-1 focus:ring-white text-sm"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3">
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-black/40 border border-gray-700 text-white py-2 pl-10 pr-8 rounded-md focus:outline-none focus:ring-1 focus:ring-white text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3">
                <TagIcon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Problems Table */}
      {filteredProblems.length > 0 ? (
        <div className="w-full">
          <ProblemTable problems={filteredProblems} />
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-16 border border-dashed border-gray-800 rounded-lg">
          <div className="text-gray-400 text-center">
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
