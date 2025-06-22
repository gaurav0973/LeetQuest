import React, { useState, useMemo, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus } from "lucide-react";
import { useActions } from "../store/useAction";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";

const ProblemsTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const { onDeleteProblem } = useActions();
  const { createPlaylist } = usePlaylistStore();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [difficulty, selectedTag, search]);

  // Extract all unique tags from problems
  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);
  // Define allowed difficulties - used in the UI buttons

  // Filter problems based on search, difficulty, and tags
  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => {
    onDeleteProblem(id);
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };
  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              difficulty === "ALL"
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            onClick={() => setDifficulty("ALL")}
          >
            All Problems
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              difficulty === "EASY"
                ? "bg-green-500 text-black"
                : "bg-green-900/20 text-green-500 hover:bg-green-900/30"
            }`}
            onClick={() => setDifficulty("EASY")}
          >
            Easy
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              difficulty === "MEDIUM"
                ? "bg-yellow-500 text-black"
                : "bg-yellow-900/20 text-yellow-500 hover:bg-yellow-900/30"
            }`}
            onClick={() => setDifficulty("MEDIUM")}
          >
            Medium
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              difficulty === "HARD"
                ? "bg-red-500 text-black"
                : "bg-red-900/20 text-red-500 hover:bg-red-900/30"
            }`}
            onClick={() => setDifficulty("HARD")}
          >
            Hard
          </button>{" "}
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedTag === "ALL"
                ? "bg-indigo-500 text-white"
                : "bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/30"
            }`}
            onClick={() => setSelectedTag("ALL")}
          >
            All Tags
          </button>
          {allTags.length > 0 &&
            allTags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedTag === tag
                    ? "bg-blue-500 text-white"
                    : "bg-black/40 text-gray-300 hover:bg-black/60"
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          {allTags.length > 3 && (
            <div className="relative group">
              <button className="px-4 py-2 bg-black/40 text-gray-300 hover:bg-black/60 text-sm font-medium rounded-md transition-colors whitespace-nowrap">
                More Tags
              </button>
              <div className="absolute left-0 mt-2 w-48 p-2 bg-black border border-gray-700 rounded-md shadow-lg hidden group-hover:block z-10">
                <div className="grid grid-cols-2 gap-2">
                  {allTags.slice(3).map((tag) => (
                    <button
                      key={tag}
                      className={`px-2 py-1 text-xs font-medium rounded transition-colors text-left ${
                        selectedTag === tag
                          ? "bg-blue-500 text-white"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-white/90 transition-colors whitespace-nowrap"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 inline mr-1.5" />
            Create Playlist
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-5">
        <input
          type="text"
          className="w-full pl-10 pr-3 py-2 text-sm text-white bg-black/40 border border-gray-700 rounded-md focus:ring-1 focus:ring-white focus:outline-none"
          placeholder="Search problems by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-800 rounded-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black/30 border-b border-gray-800">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Tags
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-24">
                Difficulty
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const isSolved =
                  problem.solvedBy?.some?.(
                    (user) => user.userId === authUser?.id
                  ) || false;

                return (
                  <tr
                    key={problem.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isSolved ? "bg-green-500" : "bg-gray-700"
                          }`}
                        ></div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/problem/${problem.id}`}
                        className="text-white hover:text-primary transition-colors"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(problem.tags || []).slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 bg-white/5 border border-gray-700 rounded text-xs text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {(problem.tags || []).length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{problem.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          problem.difficulty === "EASY"
                            ? "text-green-500 bg-green-900/20"
                            : problem.difficulty === "MEDIUM"
                              ? "text-yellow-500 bg-yellow-900/20"
                              : "text-red-500 bg-red-900/20"
                        }`}
                      >
                        {problem.difficulty.charAt(0) +
                          problem.difficulty.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                          onClick={() => handleAddToPlaylist(problem.id)}
                          title="Add to Playlist"
                        >
                          <Bookmark className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>

                        {authUser?.role === "ADMIN" && (
                          <button
                            onClick={() => handleDelete(problem.id)}
                            className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                            title="Delete Problem"
                          >
                            <TrashIcon className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">
                  No problems found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
        <div>
          Showing{" "}
          {Math.min(
            (currentPage - 1) * itemsPerPage + 1,
            filteredProblems.length
          )}
          - {Math.min(currentPage * itemsPerPage, filteredProblems.length)} of{" "}
          {filteredProblems.length} problems
        </div>

        <div className="flex gap-1">
          <button
            className={`p-2 rounded ${currentPage === 1 ? "text-gray-600" : "hover:bg-white/10"}`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            // Show pages around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  currentPage === pageNum
                    ? "bg-white text-black font-medium"
                    : "hover:bg-white/10"
                }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className={`p-2 rounded ${currentPage === totalPages ? "text-gray-600" : "hover:bg-white/10"}`}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />

      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  );
};

export default ProblemsTable;
