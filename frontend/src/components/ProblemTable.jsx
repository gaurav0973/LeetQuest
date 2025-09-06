import React, { useState, useMemo, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Bookmark, TrashIcon, Plus } from "lucide-react";
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
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  useEffect(() => setCurrentPage(1), [difficulty, selectedTag, search]);

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => (difficulty === "ALL" ? true : p.difficulty === difficulty))
      .filter((p) => (selectedTag === "ALL" ? true : p.tags?.includes(selectedTag)));
  }, [problems, search, difficulty, selectedTag]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => onDeleteProblem(id);
  const handleCreatePlaylist = async (data) => await createPlaylist(data);
  const handleAddToPlaylist = (id) => {
    setSelectedProblemId(id);
    setIsAddToPlaylistModalOpen(true);
  };

  const themedButton = (active, text, onClick) => (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
        active ? "bg-[#B48C8E22] text-[#B48C8E]" : "text-[#B48C8E] hover:bg-[#B48C8E11]"
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );

  return (
    <div className="w-full text-[#B48C8E]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {themedButton(difficulty === "ALL", "All Problems", () => setDifficulty("ALL"))}
          {themedButton(difficulty === "EASY", "Easy", () => setDifficulty("EASY"))}
          {themedButton(difficulty === "MEDIUM", "Medium", () => setDifficulty("MEDIUM"))}
          {themedButton(difficulty === "HARD", "Hard", () => setDifficulty("HARD"))}
          {themedButton(selectedTag === "ALL", "All Tags", () => setSelectedTag("ALL"))}
          {allTags.slice(0, 3).map((tag) => themedButton(selectedTag === tag, tag, () => setSelectedTag(tag)))}
        </div>
        <button
          className="px-4 py-2 bg-[#B48C8E] text-white text-sm font-medium rounded-md hover:bg-[#a07678]"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 inline mr-1.5" /> Create Playlist
        </button>
      </div>

      <input
        type="text"
        className="w-full mb-5 px-3 py-2 text-sm bg-[#F0FDFD] border border-[#B48C8E] rounded-md focus:outline-none"
        placeholder="Search problems by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto border border-[#B48C8E] rounded-md">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F0FDFD] border-b border-[#B48C8E] text-left text-xs uppercase">
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4 hidden md:table-cell">Tags</th>
              <th className="py-3 px-4">Difficulty</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProblems.map((p) => {
              const isSolved = p.solvedBy?.some((u) => u.userId === authUser?.id);
              return (
                <tr key={p.id} className="hover:bg-[#B48C8E11]">
                  <td className="py-3 px-4 text-center">
                    <div className={`w-3 h-3 rounded-full ${isSolved ? "bg-green-500" : "bg-[#B48C8E44]"}`} />
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/problem/${p.id}`} className="hover:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(p.tags || []).slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 border rounded"
                          style={{ backgroundColor: "#F0FDFD", color: "#B48C8E", borderColor: "#B48C8E" }}
                        >
                          {tag}
                        </span>
                      ))}
                      {p.tags.length > 2 && (
                        <span className="text-xs text-[#B48C8E]">+{p.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.difficulty === "EASY"
                          ? "bg-green-200 text-green-700"
                          : p.difficulty === "MEDIUM"
                          ? "bg-yellow-200 text-yellow-700"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {p.difficulty.charAt(0) + p.difficulty.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 rounded-md hover:bg-[#B48C8E11]"
                        onClick={() => handleAddToPlaylist(p.id)}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      {authUser?.role === "ADMIN" && (
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-md hover:bg-red-100"
                        >
                          <TrashIcon className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <div>
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProblems.length)}-
          {Math.min(currentPage * itemsPerPage, filteredProblems.length)} of {filteredProblems.length} problems
        </div>
        <div className="flex gap-1">
          <button
            className="px-3 py-1 rounded hover:bg-[#B48C8E11]"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
            return (
              <button
                key={pageNum}
                className={`w-8 h-8 rounded ${
                  currentPage === pageNum ? "bg-[#B48C8E] text-white" : "hover:bg-[#B48C8E11]"
                }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className="px-3 py-1 rounded hover:bg-[#B48C8E11]"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <CreatePlaylistModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreatePlaylist} />
      <AddToPlaylistModal isOpen={isAddToPlaylistModalOpen} onClose={() => setIsAddToPlaylistModalOpen(false)} problemId={selectedProblemId} />
    </div>
  );
};

export default ProblemsTable;
