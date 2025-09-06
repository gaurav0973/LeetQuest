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

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const [solvedRes, subRes, playlistsRes] = await Promise.all([
          axiosInstance.get("/problem/get-solved-problems"),
          axiosInstance.get("/submission/user"),
          axiosInstance.get("/playlist"),
        ]);

        const submissions = subRes.data.submissions || [];
        const accepted = submissions.filter((s) => s.status === "Accepted");

        setUserStats({
          solvedProblems: solvedRes.data.problems || [],
          totalSubmissions: submissions.length,
          acceptedSubmissions: accepted.length,
          playlists: playlistsRes.data.playlists || [],
          submissions: submissions.slice(0, 5),
          loading: false,
        });
      } catch (err) {
        console.error("Error fetching user stats", err);
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

    if (authUser) fetchUserStats();
  }, [authUser]);

  const getDifficultyCount = (level) =>
    userStats.solvedProblems.filter((p) => p.difficulty === level).length;

  if (userStats.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col py-6 w-full">
      {/* Background blur circles */}
      <div className="absolute top-16 left-0 w-1/4 h-1/4 bg-primary opacity-20 blur-3xl rounded-md" />
      <div className="absolute bottom-16 right-0 w-1/4 h-1/4 bg-primary opacity-20 blur-3xl rounded-md" />

      {/* Profile Info */}
      <div className="w-full bg-black/50 backdrop-blur-lg border border-gray-800 rounded-xl p-6 mb-6 flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="relative group">
          <img
            src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
            alt="User"
            className="w-24 h-24 rounded-full border-2 border-primary object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <Edit className="text-white w-5 h-5" />
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-white">{authUser?.name}</h1>
          <p className="text-gray-400">{authUser?.email}</p>
          <div className="flex gap-2 mt-2 justify-center md:justify-start">
            <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
              {authUser?.role}
            </span>
            <span className="bg-green-900/20 text-green-500 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Active
            </span>
          </div>
        </div>
        <div className="flex-1" />
        <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
          <div className="bg-white/5 p-2 rounded-lg text-center">
            <p className="text-2xl font-bold text-white">
              {userStats.solvedProblems.length}
            </p>
            <p className="text-xs text-gray-400">Solved</p>
          </div>
          <div className="bg-white/5 p-2 rounded-lg text-center">
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
        {/* Problem Difficulty */}
        <div className="bg-black/50 border border-gray-800 rounded-xl p-6 backdrop-blur-lg">
          <h2 className="text-white font-semibold mb-4 flex items-center text-lg">
            <BarChart2 className="w-5 h-5 mr-2 text-primary" />
            Problem Difficulty
          </h2>
          {["EASY", "MEDIUM", "HARD"].map((level, idx) => {
            const color = {
              EASY: "green",
              MEDIUM: "yellow",
              HARD: "red",
            }[level];
            const count = getDifficultyCount(level);
            const width = (count / Math.max(userStats.solvedProblems.length, 1)) * 100;
            return (
              <div key={idx} className="mb-4">
                <div className="flex justify-between text-sm mb-1 text-white">
                  <span className={`text-${color}-500`}>{level}</span>
                  <span className={`text-${color}-500`}>{count}</span>
                </div>
                <div className="bg-gray-700 h-2 rounded-full">
                  <div
                    className={`bg-${color}-500 h-2 rounded-full`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Submission Stats */}
        <div className="bg-black/50 border border-gray-800 rounded-xl p-6 backdrop-blur-lg">
          <h2 className="text-white font-semibold mb-4 flex items-center text-lg">
            <FileText className="w-5 h-5 mr-2 text-primary" />
            Submission Stats
          </h2>
          {[
            {
              title: "Accepted",
              value: userStats.acceptedSubmissions,
              color: "green",
              icon: CheckCircle,
            },
            {
              title: "Total Submissions",
              value: userStats.totalSubmissions,
              color: "blue",
              icon: Code,
            },
            {
              title: "Success Rate",
              value:
                userStats.totalSubmissions > 0
                  ? Math.floor(
                      (userStats.acceptedSubmissions /
                        userStats.totalSubmissions) *
                        100
                    ) + "%"
                  : "0%",
              color: "purple",
              icon: Star,
            },
          ].map(({ title, value, color, icon: Icon }, i) => (
            <div key={i} className="flex gap-4 mb-4">
              <div
                className={`w-12 h-12 bg-${color}-900/20 flex items-center justify-center rounded-lg`}
              >
                <Icon className={`w-6 h-6 text-${color}-500`} />
              </div>
              <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-xl text-white font-bold">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Playlists */}
        <div className="bg-black/50 border border-gray-800 rounded-xl p-6 backdrop-blur-lg">
          <h2 className="text-white font-semibold mb-4 flex items-center text-lg">
            <BookOpen className="w-5 h-5 mr-2 text-primary" />
            My Playlists
          </h2>
          {userStats.playlists.length > 0 ? (
            <ul className="space-y-3">
              {userStats.playlists.map((p) => (
                <li
                  key={p.id}
                  className="bg-white/5 p-3 rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <div className="text-white font-medium">{p.name}</div>
                  <div className="text-xs text-gray-400">
                    {p.description || "No description"}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-4 border border-dashed border-gray-700 rounded-lg">
              <p className="text-gray-400">No playlists created yet</p>
              <button className="mt-2 px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/80">
                Create Playlist
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="w-full bg-black/50 border border-gray-800 rounded-xl p-6 backdrop-blur-lg">
        <h2 className="text-white font-semibold mb-4 flex items-center text-lg">
          <Clock className="w-5 h-5 mr-2 text-primary" />
          Recent Activity
        </h2>
        {userStats.submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400 border-b border-gray-800">
                <tr>
                  <th>Problem</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Memory</th>
                </tr>
              </thead>
              <tbody>
                {userStats.submissions.map((sub) => (
                  <tr key={sub.id} className="border-t border-gray-800">
                    <td className="py-2 text-white">{sub.problem?.title}</td>
                    <td className="py-2 text-gray-400">{sub.language}</td>
                    <td className="py-2">
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
                    <td className="py-2 text-gray-400">{sub.time || "N/A"}</td>
                    <td className="py-2 text-gray-400">
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
            <button className="mt-2 px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/80">
              Solve Problems
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
