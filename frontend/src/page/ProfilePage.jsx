import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useProblemStore } from "../store/useProblemStore";
import {
  Loader,
  Edit,
  CheckCircle,
  FileText,
  Code,
  BookOpen,
  Star,
  BarChart2,
  Clock,
} from "lucide-react";
import { axiosInstance } from "../lib/axios";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const { problems } = useProblemStore();
  const [userStats, setUserStats] = useState({
    solvedProblems: [],
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    playlists: [],
    submissions: [],
    loading: true,
  });
  // Get user stats when the component mounts
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // Get solved problems - use the correct endpoint
        const solvedResponse = await axiosInstance.get(
          `/problem/get-solved-problems`
        );
        console.log("Solved problems response:", solvedResponse.data);

        // Get submissions
        const submissionsResponse = await axiosInstance.get(`/submission/user`);
        console.log("Submissions response:", submissionsResponse.data);

        // Get playlists
        const playlistsResponse = await axiosInstance.get(`/playlist`);
        console.log("Playlists response:", playlistsResponse.data);

        const submissions = submissionsResponse.data.submissions || [];
        const acceptedSubmissions = submissions.filter(
          (sub) => sub.status === "Accepted"
        );

        setUserStats({
          solvedProblems: solvedResponse.data.problems || [],
          totalSubmissions: submissions.length,
          acceptedSubmissions: acceptedSubmissions.length,
          playlists: playlistsResponse.data.playlists || [],
          submissions: submissions.slice(0, 5) || [],
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
        // Set default values in case of errors
        setUserStats({
          solvedProblems: [],
          totalSubmissions: 0,
          acceptedSubmissions: 0,
          playlists: [],
          submissions: [],
          loading: false,
        });
      }
    };

    if (authUser) {
      fetchUserStats();
    }
  }, [authUser]);

  const getDifficultyCount = (difficulty) => {
    return userStats.solvedProblems.filter(
      (prob) => prob.difficulty === difficulty
    ).length;
  };

  if (userStats.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col py-6 w-full">
      {/* Background effects */}
      <div className="absolute top-16 left-0 w-1/4 h-1/4 bg-primary opacity-20 blur-3xl rounded-md"></div>
      <div className="absolute bottom-16 right-0 w-1/4 h-1/4 bg-primary opacity-20 blur-3xl rounded-md"></div>
      {/* Profile Header */}
      <div className="w-full bg-black/50 backdrop-blur-lg border border-gray-800 rounded-xl p-6 mb-6 flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="relative group">
          <img
            src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-primary"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Edit className="text-white w-5 h-5" />
          </div>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-white">
            {authUser?.name || "User"}
          </h1>
          <p className="text-gray-400">{authUser?.email}</p>
          <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
            <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
              {authUser?.role}
            </span>
            <span className="bg-green-900/20 text-green-500 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Active
            </span>
          </div>
        </div>

        <div className="flex-1"></div>

        <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <p className="text-2xl font-bold text-white">
              {userStats.solvedProblems.length}
            </p>
            <p className="text-xs text-gray-400">Problems Solved</p>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <p className="text-2xl font-bold text-white">
              {problems.length > 0
                ? Math.floor(
                    (userStats.solvedProblems.length / problems.length) * 100
                  )
                : 0}
              %
            </p>
            <p className="text-xs text-gray-400">Completion</p>
          </div>
        </div>
      </div>{" "}
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
        {/* Solved Problems by Difficulty */}
        <div className="bg-black/50 backdrop-blur-lg border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-primary" />
            Problem Difficulty
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-green-500">Easy</span>
                <span className="text-green-500">
                  {getDifficultyCount("EASY")}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${(getDifficultyCount("EASY") / Math.max(1, userStats.solvedProblems.length)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-yellow-500">Medium</span>
                <span className="text-yellow-500">
                  {getDifficultyCount("MEDIUM")}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${(getDifficultyCount("MEDIUM") / Math.max(1, userStats.solvedProblems.length)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-red-500">Hard</span>
                <span className="text-red-500">
                  {getDifficultyCount("HARD")}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${(getDifficultyCount("HARD") / Math.max(1, userStats.solvedProblems.length)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Stats */}
        <div className="bg-black/50 backdrop-blur-lg border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary" />
            Submission Stats
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Accepted</p>
                <p className="text-xl font-bold text-white">
                  {userStats.acceptedSubmissions}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-900/20 flex items-center justify-center">
                <Code className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Submissions</p>
                <p className="text-xl font-bold text-white">
                  {userStats.totalSubmissions}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-900/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-xl font-bold text-white">
                  {userStats.totalSubmissions > 0
                    ? Math.floor(
                        (userStats.acceptedSubmissions /
                          userStats.totalSubmissions) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Playlists */}
        <div className="bg-black/50 backdrop-blur-lg border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-primary" />
            My Playlists
          </h2>

          {userStats.playlists.length > 0 ? (
            <ul className="space-y-3">
              {userStats.playlists.map((playlist) => (
                <li
                  key={playlist.id}
                  className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="font-medium text-white">{playlist.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {playlist.description || "No description"}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-6 border border-dashed border-gray-700 rounded-lg">
              <p className="text-gray-400">No playlists created yet</p>
              <button className="mt-2 px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/80 transition-colors">
                Create Playlist
              </button>
            </div>
          )}
        </div>
      </div>{" "}
      {/* Recent Activity */}
      <div className="w-full bg-black/50 backdrop-blur-lg border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary" />
          Recent Activity
        </h2>

        {userStats.submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-3 text-gray-400 font-medium">Problem</th>
                  <th className="pb-3 text-gray-400 font-medium">Language</th>
                  <th className="pb-3 text-gray-400 font-medium">Status</th>
                  <th className="pb-3 text-gray-400 font-medium">Time</th>
                  <th className="pb-3 text-gray-400 font-medium">Memory</th>
                </tr>
              </thead>
              <tbody>
                {userStats.submissions.map((sub) => (
                  <tr key={sub.id} className="border-t border-gray-800">
                    <td className="py-3 text-white">
                      {sub.problem?.title || "Unknown"}
                    </td>
                    <td className="py-3 text-gray-400">{sub.language}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          sub.status === "Accepted"
                            ? "bg-green-900/20 text-green-500"
                            : "bg-red-900/20 text-red-500"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">{sub.time || "N/A"}</td>
                    <td className="py-3 text-gray-400">
                      {sub.memory || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-6 border border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400">No recent submissions</p>
            <button className="mt-2 px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/80 transition-colors">
              Solve Problems
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
