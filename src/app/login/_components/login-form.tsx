"use client";

import React, { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/actions/admin";
import { LoginButton } from "./submit-button";
import { ErrorMessage } from "@/app/_components/error-message";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action] = useActionState(login, {
    error: null,
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-8 py-6 border-b border-slate-100">
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-medium">DO</span>
            </div>
            <h1 className="text-lg font-semibold text-slate-800">
              DESA OENGKOLAKI
            </h1>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="mb-8">
          <div className="py-3 px-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
            <p className="text-xs font-medium text-blue-600 text-center">
              Selamat datang di sistem
            </p>
            <p className="text-sm text-slate-800 mt-1 font-medium text-center">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>
        </div>

        {state.error && <ErrorMessage message={state.error} />}

        <form action={action}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                className="w-full px-4 py-3 rounded-lg 
                  border border-slate-200
                  bg-white text-slate-800
                  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                  hover:border-slate-300
                  transition-colors duration-200
                  placeholder:text-slate-400"
                placeholder="Masukkan username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-lg 
                    border border-slate-200
                    bg-white text-slate-800
                    focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                    hover:border-slate-300
                    transition-colors duration-200
                    placeholder:text-slate-400"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                    p-1 rounded-md
                    text-slate-400 hover:text-slate-600 hover:bg-slate-100
                    transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <LoginButton />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
