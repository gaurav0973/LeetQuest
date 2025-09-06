import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import ProfilePage from "./page/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Layout from "./layout/Layout";
import AdminRoute from "./components/AdminRoute";
import AddProblem from "./page/AddProblem";
import ProblemPage from "./page/ProblemPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-base-300 to-base-200 text-base-content">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={authUser ? <Layout /> : <Navigate to="/login" />}>

          <Route index element={<HomePage />} />

          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/problem/:id" element={<ProblemPage />} />

        </Route>

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />

        <Route element={<AdminRoute />}>
          <Route
            path="/add-problem"
            element={authUser ? <AddProblem /> : <Navigate to="/" />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
