import React, { useState, useMemo } from "react";
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

  // Extract all unique tags from problems
  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  // Define allowed difficulties
  const difficulties = ["EASY", "MEDIUM", "HARD"];

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
    <div className="w-full max-w-6xl mx-auto">
      {/* Header with Create Playlist Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-white/90 transition-colors"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 inline mr-1.5" />
            Create Playlist
          </button>
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
