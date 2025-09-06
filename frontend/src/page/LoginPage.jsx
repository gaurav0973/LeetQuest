import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { z } from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const { isLoggingIn, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-[#fffafa] text-[#3b2e2e]">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-[#f8f4f3] border border-[#b48c8e] flex items-center justify-center group-hover:bg-[#f0e8e7] transition-colors">
                <Code className="w-6 h-6 text-[#b48c8e]" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-[#5e4444]">Login to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="font-medium text-[#3b2e2e]">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#a58d8f]" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`input input-bordered w-full pl-10 bg-[#fff] text-[#3b2e2e] border ${
                    errors.email ? "border-red-500" : "border-[#b48c8e]"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="font-medium text-[#3b2e2e]">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#a58d8f]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`input input-bordered w-full pl-10 bg-[#fff] text-[#3b2e2e] border ${
                    errors.password ? "border-red-500" : "border-[#b48c8e]"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#a58d8f]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#a58d8f]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn w-full bg-[#b48c8e] text-white hover:bg-[#a77c7e]"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-[#5e4444]">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link text-[#b48c8e] underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Pattern/Image */}
      <AuthImagePattern
        title="Welcome back!"
        subtitle="Sign in to continue your journey with us. Don't have an account? Create one now."
      />
    </div>
  );
};

export default LoginPage;
